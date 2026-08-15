const initialState = {
  isVisible: false,
  id: 0
}

export const bankReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_BANK':
      return {
        isVisible: true,
        id: action.id
      }
    case 'HIDE_BANK':
      return {
        ...state,
        isVisible: false
      }
    default:
      return state
  }
}