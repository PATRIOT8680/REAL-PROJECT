import { setDonatCoins, addDonatCoins, decrementDonatCoins } from "../../actions/elements/playerInfo/donatcoins.ts";
import { store } from "../store.ts";

export const donatCoinsStore = {
  setDonatCoins: (amount: number) => store.dispatch(setDonatCoins(amount)),
  addDonatCoins: (amount: number) => store.dispatch(addDonatCoins(amount)),
  decrementDonatCoins: (amount: number) => store.dispatch(decrementDonatCoins(amount)),
}