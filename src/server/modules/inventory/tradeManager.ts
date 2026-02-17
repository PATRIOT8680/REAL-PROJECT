import { rce } from "../../utils/rce";
import { connectedUsers } from "../../data/dataConnectedUser";
import { getPlayerInventory, addItemToInventory, canAddItemInventory, sendInventoryToCef, getEquippedBag } from "./inventoryHandlers";
import { normalizeSlots,  } from "./inventoryMove";
import { getItemById } from "./items";
import chalk from "chalk";

interface ITradeOffer {
  id: number,
  quantity: number
}

interface IActiveTrade {
  player1: PlayerMp,
  player2: PlayerMp,
  offers1: (ITradeOffer | null)[]
  offers2: (ITradeOffer | null)[]
  ready1: boolean,
  ready2: boolean,
  confirmTimer: NodeJS.Timeout | null
}


export const activeTrades = new Map<string, IActiveTrade>()

export const getTradeKey = (p1: PlayerMp, p2: PlayerMp): string => {
  const ids = [p1.id, p2.id].sort((a, b) => a - b)
  return `${ids[0]}-${ids[1]}`
}

export const getTradeForPlayer = (player: PlayerMp): { key: string, trade: IActiveTrade } => {
  for (const [key, trade] of activeTrades.entries()) {
    if (trade.player1 === player || trade.player2 === player) {
      return { key, trade }
    }
  }
  return null
}

export const getMyOffers = (trade: IActiveTrade, player: PlayerMp): (ITradeOffer | null)[] => {
  return player === trade.player1 ? trade.offers1 : trade.offers2
}

export const getPartnerOffers = (trade: IActiveTrade, player: PlayerMp): (ITradeOffer | null)[] => {
  return player === trade.player1 ? trade.offers2 : trade.offers1
}

export const updateStatuses = (trade: IActiveTrade) => {
  [trade.player1, trade.player2].forEach((player: PlayerMp) => {
    if (!player || mp.players.at(player.id) !== player) return

    const isMeReady = player === trade.player1 ? trade.ready1 : trade.ready2
    const isOtherReady = player === trade.player1 ? trade.ready2 : trade.ready1

    let status = 'no-ready'

    if (isMeReady && isOtherReady) status = 'both-ready'
    else if (isMeReady) status = 'my-ready'
    else if (isOtherReady) status = 'other-ready'

    rce.triggerClient(player, 'execute', `window.App.inventoryReducer.setTradeStatus('${status}')`)
  })
}

const returnItems = async (player: PlayerMp, offers: (ITradeOffer | null)[]) => {
  const uid = connectedUsers.getField(player.id, 'uid')
  if (!uid) return

  for (const offer of offers) {
    if (offer) {
      await addItemToInventory(uid, offer.id, offer.quantity)
    }
  }
  await sendInventoryToCef(player, uid)
}

export const cancelTrade = async (key: string, reason?: string) => {
  const trade = activeTrades.get(key)
  if (!trade) return

  if (trade.confirmTimer) {
    clearTimeout(trade.confirmTimer)
    trade.confirmTimer = null
  }

  const { player1, player2, offers1, offers2 } = trade

  await returnItems(player1, offers1)
  await returnItems(player2, offers2)

  activeTrades.delete(key);

  [trade.player1, trade.player2].forEach((player: PlayerMp) => {
    if (player && mp.players.exists(player)) {
      rce.triggerClient(player, 'execute', `window.App.inventoryReducer.setTradeStatus('no-ready')`)

      if (reason) {
        rce.triggerClient(player, 'sendNotify', 'err', reason, 4000, 'bottom')
      }

      rce.triggerClient(player, 'hideInventory')
    }
  })
}

export const executeTrade = async (key: string) => {
  const trade = activeTrades.get(key)
  if (!trade) return

  const { player1, player2, offers1, offers2 } = trade

  if (!mp.players.exists(player1) || !mp.players.exists(player2)) {
    cancelTrade(key, 'Один из игроков вышел из игры!')
    return
  }

  const uid1 = connectedUsers.getField(player1.id, 'uid')
  const uid2 = connectedUsers.getField(player2.id, 'uid')

  if (!uid1 || !uid2) {
    cancelTrade(key, 'Ошибка синхронизации данных')
    return
  }

  const itemsTo1 = offers2.filter((i): i is ITradeOffer => i !== null)
  const itemsTo2 = offers1.filter((i): i is ITradeOffer => i !== null)

  async function canAddAllItems(uid: number, items: ITradeOffer[]): Promise<boolean> {
    const inventory = await getPlayerInventory(uid)
    if (!inventory) return false

    let totalWeight = 0
    for (const item of items) {
      const itemData = getItemById(item.id)
      if (!itemData) return false
      totalWeight += itemData.weight * item.quantity
    }
    if (inventory.weight + totalWeight > inventory.maxweight) return false

    const mainSlots = normalizeSlots(JSON.parse(inventory.mainslots))
    const donatData = JSON.parse(inventory.donatslots)
    const donatSlots = donatData.have ? normalizeSlots(donatData.slots || [], 15) : []
    const bagData = await getEquippedBag(uid)
    const bagSlots = bagData ? normalizeSlots(JSON.parse(bagData.items)) : []

    const tryAddItem = (slots: any[], item: ITradeOffer, itemData: any): boolean => {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        if (slot && slot.id === item.id && itemData.stackable) {
          if (slot.quantity + item.quantity <= itemData.maxStack) {
            slots[i] = { ...slot, quantity: slot.quantity + item.quantity }
            return true
          }
        }
      }

      const freeIdx = slots.findIndex(s => s === null)
      if (freeIdx !== -1) {
        slots[freeIdx] = { id: item.id, quantity: item.quantity }
        return true
      }
      return false
    }

    for (const item of items) {
      const itemData = getItemById(item.id)
      if (!itemData) return false

      if (tryAddItem(mainSlots, item, itemData)) continue
      if (tryAddItem(donatSlots, item, itemData)) continue
      if (tryAddItem(bagSlots, item, itemData)) continue

      return false
    }
    return true
  }

  const can1 = await canAddAllItems(uid1, itemsTo1)
  const can2 = await canAddAllItems(uid2, itemsTo2)

  if (!can1 || !can2) {
    [player1, player2].forEach((player: PlayerMp) => {
      rce.triggerClient(player, 'sendNotify', 'err', 'У одного из игроков недостаточно места в инвентаре', 4500, 'bottom')
    })

    trade.ready1 = false
    trade.ready2 = false
    updateStatuses(trade)
    return
  }

  for (const item of itemsTo1) {
    const result = await addItemToInventory(uid1, item.id, item.quantity)
    if (!result.success) {
      await returnItems(player1, offers1)
      await returnItems(player2, offers2)
      activeTrades.delete(key)
      return
    }
  }

  for (const item of itemsTo2) {
    const result = await addItemToInventory(uid2, item.id, item.quantity)
    if (!result.success) {
      await returnItems(player1, offers1)
      await returnItems(player2, offers2)
      activeTrades.delete(key)
      return
    }
  }

  activeTrades.delete(key)
  await sendInventoryToCef(player1, uid1)
  await sendInventoryToCef(player2, uid2);

  [player1, player2].forEach((player: PlayerMp) => {
    rce.triggerClient(player, 'sendNotify', 'success', 'Обмен успешно завершен!', 3000, 'top')
    rce.triggerClient(player, 'hideInventory')
  })
}

export const acceptTrade = (player: PlayerMp, requestorId: number) => {
  const requestor = mp.players.at(requestorId)
  if (!requestor || !mp.players.exists(requestor)) return

  const key = getTradeKey(player, requestor)

  if (activeTrades.has(key)) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Трейд уже активен', 3000, 'bottom')
    return
  }

  const trade = {
    player1: requestor,
    player2: player,
    offers1: Array(5).fill(null),
    offers2: Array(5).fill(null),
    ready1: false,
    ready2: false,
    confirmTimer: null
  }

  activeTrades.set(key, trade)

  rce.triggerClient(requestor, 'showInventory', true)
  rce.triggerClient(player, 'showInventory', true)

  updateStatuses(trade)
}

// -----------
// Events
// -----------

rce.registerCef('tradeSetReady', (player: PlayerMp, ready: boolean) => {
  const tradeInfo = getTradeForPlayer(player)
  if (!tradeInfo) return

  const { trade } = tradeInfo

  if (player === trade.player1) trade.ready1 = ready
  else trade.ready2 = ready

  if (trade.confirmTimer) {
    clearTimeout(trade.confirmTimer)
    trade.confirmTimer = null
  }

  updateStatuses(trade)
  if (trade.ready1 && trade.ready2) {
    trade.confirmTimer = setTimeout(() => {
      executeTrade(tradeInfo.key)
    }, 3000)
  }
})

rce.registerCef('tradeCancel', (player: PlayerMp) => {
  const tradeInfo = getTradeForPlayer(player)
  if (!tradeInfo) return

  cancelTrade(tradeInfo.key, 'Обмен отменен одним из игроков')
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  const tradeInfo = getTradeForPlayer(player)
  if (tradeInfo) {
    cancelTrade(tradeInfo.key, 'Игрок отключился от сервера')
  }
});