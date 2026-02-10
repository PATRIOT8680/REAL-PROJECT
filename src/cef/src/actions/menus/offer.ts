export const showOffer = (title: string, description: string, duration: number) => {
  return { type: 'SHOW_OFFER', title, description, duration }
}

export const hideOffer = () => {
  return { type: 'HIDE_OFFER' }
}