import { store } from "../store.ts"
import { addCash, decrementCash, setCash } from "../../actions/elements/playerInfo/cash.ts";

export const cashStore = {
  setCash: (amount: number) => store.dispatch(setCash(amount)),
  addCash: (amount: number) => store.dispatch(addCash(amount)),
  decrementCash: (amount: number) => store.dispatch(decrementCash(amount)),
}