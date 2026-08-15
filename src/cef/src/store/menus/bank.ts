import { store } from "../store";
import { showBank, hideBank } from "../../actions/menus/bank.ts";

export const bankStore = {
  showBank: (id: number) => store.dispatch(showBank(id)),
  hideBank: () => store.dispatch(hideBank()),
}