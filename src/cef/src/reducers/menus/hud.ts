const initialState = {
  isVisible: false,
  speedometerVisible: false,
  rightX: 0,
  leftX: 0,
  topY: 0,
  bottomY: 0,
  width: 0,
  height: 0,
}

export const hudReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_HUD':
      return {
        ...state,
        isVisible: true,
        speedometerVisible: action.speedometerVisible,
        rightX: action.rightX,
        leftX: action.leftX,
        topY: action.topY,
        bottomY: action.bottomY,
        width: action.width,
        height: action.height,
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