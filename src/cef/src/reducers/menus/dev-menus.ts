const initialState = {
  isVisible: false,
  newRentVisible: false,
  createBusinessVisible: false,
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
    case 'SHOW_CREATE_BUSINESS':
      return {
        ...state,
        isVisible: true,
        createBusinessVisible: true
      }
    case 'HIDE_CREATE_BUSINESS':
      return {
        ...state,
        isVisible: false,
        createBusinessVisible: false
      }
    default:
      return state
  }
}