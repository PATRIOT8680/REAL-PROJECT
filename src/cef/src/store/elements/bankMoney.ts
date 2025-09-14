import { store } from "../store.ts"
import { addBankMoney, decrementBankMoney, setBankMoney } from "../../actions/elements/playerInfo/bankMoney.ts";

export const bankMoneyStore = {
  setBankMoney: (amount: number) => store.dispatch(setBankMoney(amount)),
  addBankMoney: (amount: number) => store.dispatch(addBankMoney(amount)),
  decrementBankMoney: (amount: number) => store.dispatch(decrementBankMoney(amount)),
}