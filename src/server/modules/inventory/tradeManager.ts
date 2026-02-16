import { rce } from "../../utils/rce";
import { connectedUsers } from "../../data/dataConnectedUser";
import { getPlayerInventory, addItemToInventory, canAddItemInventory, sendInventoryToCef } from "./inventoryHandlers";

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

  let canGiveTo1 = true
  for (const item of itemsTo1) {
    const check = await canAddItemInventory(uid1, item.id, item.quantity)

    if (!check.canAdd) {
      canGiveTo1 = false
      break
    }
  }

  let canGiveTo2 = true
  for (const item of itemsTo2) {
    const check = await canAddItemInventory(uid2, item.id, item.quantity)

    if (!check.canAdd) {
      canGiveTo2 = false
      break
    }
  }

  if (!canGiveTo1 || !canGiveTo2) {
    [player1, player2].forEach((player: PlayerMp) => {
      rce.triggerClient(player, 'sendNotify', 'err', 'У одного из игроков недостаточно места в инвентаре', 4500, 'bottom')
    })

    trade.ready1 = false
    trade.ready2 = false
    updateStatuses(trade)

    await returnItems(player1, offers1)
    await returnItems(player2, offers2)

    return
  }

  for (const item of itemsTo1) {
    await addItemToInventory(uid1, item.id, item.quantity)
  }

  for (const item of itemsTo2) {
    await addItemToInventory(uid2, item.id, item.quantity)
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