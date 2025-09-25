export const adminMenuReducer = (state = { isVisible: false }, action: any) => {
  switch (action.type) {
    case 'SHOW_ADMIN_MENU':
      return { isVisible: true }
    case 'HIDE_ADMIN_MENU':
      return { isVisible: false }
    default:
      return state
  }
}