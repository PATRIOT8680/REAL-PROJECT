export const setDonatCoins = (amount: number) => {
  return { type: 'SET_DONAT_COINS', payload: amount }
}

export const addDonatCoins = (amount: number) => {
  return { type: 'ADD_DONAT_COINS', payload: amount }
}

export const decrementDonatCoins = (amount: number) => {
  return { type: 'DECREMENT_DONAT_COINS', payload: amount }
}