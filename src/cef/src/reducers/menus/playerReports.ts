export const playerReportsReducer = (state = { isVisible: false }, action: any) => {
  switch (action.type) {
    case 'SHOW_PLAYER_REPORTS':
      return { isVisible: true }
    case 'HIDE_PLAYER_REPORTS':
      return { isVisible: false }
    default:
      return state
  }
}