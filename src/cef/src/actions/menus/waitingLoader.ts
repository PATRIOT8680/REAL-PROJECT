export const showWaitingLoader = (duration: number, subtitle: string) => {
  return { type: 'SHOW_WAITING_LOADER', duration, subtitle }
}

export const hideWaitingLoader = () => {
  return { type: 'HIDE_WAITING_LOADER' }
}