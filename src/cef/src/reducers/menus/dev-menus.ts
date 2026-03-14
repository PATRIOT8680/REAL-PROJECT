const initialState = {
  isVisible: false,
  newRentVisible: false,
}

export const devMenusReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_NEW_RENT':
      return {
        ...state,
        isVisible: true,
        newRentVisible: true,
      }
    case 'HIDE_NEW_RENT':
      return {
        ...state,
        isVisible: false,
        newRentVisible: false,
      }
    default:
      return state
  }
}