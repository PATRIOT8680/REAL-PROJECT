const listNumberChar = new Map<number, number>()

export const getNumberChar = (playerId: number) => {
  return listNumberChar.get(playerId)
}

export const setNumberChar = (playerId: number, numberSlot: number) => {
  listNumberChar.set(playerId, numberSlot)
}

mp.events.add('playerQuit', (player: PlayerMp) => {
  setTimeout(() => {
    listNumberChar.delete(player.id)
  }, 200)
})