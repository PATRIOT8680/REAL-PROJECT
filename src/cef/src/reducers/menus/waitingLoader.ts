export const waitingLoaderReducer = (state = { isVisible: false, duration: 0, subtitle: '' }, action: any) => {
  switch (action.type) {
    case 'SHOW_WAITING_LOADER':
      return { isVisible: true, duration: action.duration, subtitle: action.subtitle }
    case 'HIDE_WAITING_LOADER':
      return { isVisible: false, duration: 0, subtitle: '' }
    default:
      return state
  }
}