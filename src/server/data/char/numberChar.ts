import { rce } from "../../utils/rce";

const listNumberChar = new Map<number, number>()

export const getNumberChar = (playerId: number) => {
  return listNumberChar.get(playerId)
}

export const setNumberChar = (playerId: number, numberSlot: number) => {
  listNumberChar.set(playerId, numberSlot)
}

rce.registerClientCef('setNumberChar', (player: PlayerMp, numberSlot: number) => {
  setNumberChar(player.id, numberSlot)
})

rce.register('setNumberChar', (player: PlayerMp, numberSlot: number) => {
  setNumberChar(player.id, numberSlot)
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  setTimeout(() => {
    listNumberChar.delete(player.id)
  }, 200)
})