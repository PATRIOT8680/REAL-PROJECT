export const cashReducer = (state = 10000, action: any) => {
  switch (action.type) {
    case 'SET_CASH':
      return action.payload
    case 'ADD_CASH':
      return state + action.payload
    case 'DECREMENT_CASH':
      return state - action.payload
    default:
      return state
  }
}