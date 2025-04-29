import { store } from "../store";
import { showWelcome, hideWelcome } from "../../actions/menus/welcome";

export const welcomeStore = {
  showWelcome: () => store.dispatch(showWelcome()),
  hideWelcome: () => store.dispatch(hideWelcome()),
}