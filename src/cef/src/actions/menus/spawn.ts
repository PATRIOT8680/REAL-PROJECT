export const showSpawn = (selectedSlot: number, nickName: string) => {
  return { type: 'SHOW_SPAWN', selectedSlot, nickName }
}

export const hideSpawn = () => {
  return { type: 'HIDE_SPAWN' }
}