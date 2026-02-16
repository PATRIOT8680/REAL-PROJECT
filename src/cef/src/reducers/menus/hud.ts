const initialState = {
  isVisible: true,
  speedometerVisible: true,
}

export const hudReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_HUD':
      return {
        isVisible: true,
        speedometerVisible: action.speedometerVisible
      }
    case 'HIDE_HUD':
      return {
        ...state,
        isVisible: false
      }
    default:
      return state
  }
}