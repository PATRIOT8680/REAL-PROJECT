import { store } from "../store";
import { showNewRent, hideNewRent } from "../../actions/menus/dev-menus/newRent.ts";

export const devMenusStore = {
  showNewRent: () => store.dispatch(showNewRent()),
  hideNewRent: () => store.dispatch(hideNewRent()),
}