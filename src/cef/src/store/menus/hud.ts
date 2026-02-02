import { store } from "../store.ts";
import { showHud, hideHud } from "../../actions/menus/hud.ts";

export const hudStore = {
  showHud: (speedometerVisible?: boolean) => store.dispatch(showHud(speedometerVisible)),
  hideHud: () => store.dispatch(hideHud()),
}