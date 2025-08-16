export const hudReducer = (state = { isVisible: false }, action: any) => {
  switch (action.type) {
    case 'SHOW_HUD':
      return { isVisible: true }
    case 'HIDE_HUD':
      return { isVisible: false }
    default:
      return state
  }
}