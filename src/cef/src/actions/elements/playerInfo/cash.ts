<<<<<<< HEAD
=======
import { rce } from "../../../modules/rce.ts";

>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
export const setCash = (amount: number) => {
  return { type: 'SET_CASH', payload: amount }
}

export const addCash = (amount: number) => {
  return { type: 'ADD_CASH', payload: amount }
}

export const decrementCash = (amount: number) => {
  return { type: 'DECREMENT_CASH', payload: amount }
}