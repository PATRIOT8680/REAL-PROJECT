export const hoverInteractionReducer = (state = { isVisible: true, hovered: false }, action: any) => {
  switch (action.type) {
    case 'VISIBLE_HOVER_INTERACTION':
      return { ...state, isVisible: action.isVisible }
    case 'SET_HOVER_INTERACTION':
      return { ...state, hovered: true }
    case 'REMOVE_HOVER_INTERACTION':
      return { ...state, hovered: false }
    default:
      return state
  }
}