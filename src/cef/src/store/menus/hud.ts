import { store } from "../store.ts";
import { showHud, hideHud } from "../../actions/menus/hud.ts";

export const hudStore = {
  showHud: () => store.dispatch(showHud()),
  hideHud: () => store.dispatch(hideHud()),
}