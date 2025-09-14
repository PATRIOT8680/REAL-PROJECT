export const bankMoneyReducer = (state = 10000, action: any) => {
  switch (action.type) {
    case 'SET_BANK_MONEY':
      return action.payload
    case 'ADD_BANK_MONEY':
      return state + action.payload
    case 'DECREMENT_BANK_MONEY':
      return state - action.payload
    default:
      return state
  }
}