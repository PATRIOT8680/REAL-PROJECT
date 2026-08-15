export const showBank = (id: number) => {
  return { type: 'SHOW_BANK', id }
}

export const hideBank = () => {
  return { type: 'HIDE_BANK' }
}