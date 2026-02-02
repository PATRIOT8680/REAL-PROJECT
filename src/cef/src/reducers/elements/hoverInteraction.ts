export const hoverInteractionReducer = (state = { hovered: false }, action: any) => {
  switch (action.type) {
    case 'SET_HOVER_INTERACTION':
      return { hovered: true }
    case 'REMOVE_HOVER_INTERACTION':
      return { hovered: false }
    default:
      return state
  }
}