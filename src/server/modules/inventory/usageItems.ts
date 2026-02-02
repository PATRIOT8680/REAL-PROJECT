import { send, meAction } from "../../menus/chat";
import { getItemById } from "./items";
import { rce } from "../../utils/rce";
import { connectedUsers } from "../../data/dataConnectedUser";

export const usageDrinking = async (player: PlayerMp, itemId: number) => {
  const item = getItemById(itemId)
  if (!item.foodData) return

  const { waitingUsage, anim, healthRestore, eatRestore, waterRestore } = item.foodData
  const gender = connectedUsers.getField(player.id, 'gender')
  const actionVerb = gender === 'male' ? 'выпил' : 'выпила'

  rce.triggerClient(player, 'hideInventory')
  rce.triggerClient(player, 'execute', `window.App.waitingLoaderReducer.showWaitingLoader(${waitingUsage}, 'Использование')`)
  if (anim && anim.dict && anim.name) {
    rce.triggerClient(player, 'playAnim', anim.dict, anim.name, anim.flag, waitingUsage)
  }

  if (waitingUsage) {
    await new Promise(resolve => setTimeout(resolve, waitingUsage))
  }

  meAction(player, `${actionVerb} "${item.name}"`)
  rce.triggerClient(player, 'sendNotify', 'success', `Вы выпили "${item.name}!"`, 2500, 'bottom')
}

export const usageFood = (player: PlayerMp, name: string) => {
  const gender = player.getVariable('gender')
  send(player, `${gender === 'male' ? 'Гражданин' : 'Гражданка'} #${player.id} съел${gender === 'female' ? 'а' : ''} ${name}`, true, 'me', 15)
}

export const usageWeapon = (player: PlayerMp, weapon: string) => {
  const gender = player.getVariable('gender')
  send(player, `${gender === 'male' ? 'Гражданин' : 'Гражданка'} #${player.id} достал${gender === 'female' ? 'а' : ''} с кармана ${weapon}`, true, 'me', 15)
}

export const usageAmmo = (player: PlayerMp, ammoName: string) => {
  const gender = player.getVariable('gender')
  send(player, `${gender === 'male' ? 'Гражданин' : 'Гражданка'} #${player.id} зарядил${gender === 'female' ? 'а' : ''} оружие патронами ${ammoName}`, true, 'me', 15)
}

export const usageFunctions: Record<number, (player: PlayerMp) => void> = {
  1: (player: PlayerMp) => usageDrinking(player, 1),
  2: (player: PlayerMp) => usageFood(player, 'Бургер Чиз Классик'),
  500: (player: PlayerMp) => usageWeapon(player, 'Pistol'),
  570: (player: PlayerMp) => usageAmmo(player, '9x19mm'),
}

export const getUsageFunction = (itemId: number) => {
  return usageFunctions[itemId]
}

export const useClothes = (player: PlayerMp, itemId: number, isEquip: boolean = true) => {
  const item = getItemById(itemId)

  if (!item || item.type !== 'clothes' || !item.clothesData) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Это не одежда!', 3000, 'bottom')
    return
  }

  const gender = connectedUsers.getField(player.id, 'gender')
  const name = item.name
  const action = isEquip ? `одел${gender === 'female' ? 'a' : '' }` : `снял${gender === 'female' ? 'a' : '' }`

  send(player, `${gender === 'male' ? 'Гражданин' : 'Гражданка'} #${player.id} ${action} "${name}"`, true, 'me', 15)
}