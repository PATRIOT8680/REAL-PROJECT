export const setBankMoney = (amount: number) => {
  return { type: 'SET_BANK_MONEY', payload: amount }
}

export const addBankMoney = (amount: number) => {
  return { type: 'ADD_BANK_MONEY', payload: amount }
}

export const decrementBankMoney = (amount: number) => {
  return { type: 'DECREMENT_BANK_MONEY', payload: amount }
}