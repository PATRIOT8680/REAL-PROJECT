export const donatCoinsReducer = (state = 5000, action: any) => {
  switch (action.type) {
    case 'SET_DONAT_COINS':
      return action.payload
    case 'ADD_DONAT_COINS':
      return state + action.payload
    case 'DECREMENT_DONAT_COINS':
      return state - action.payload
    default:
      return state
  }
}