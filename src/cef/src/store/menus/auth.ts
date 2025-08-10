import { store } from "../store";
import { showAuth, hideAuth } from "../../actions/menus/auth";

export const authStore = {
  showAuth: () => store.dispatch(showAuth()),
  hideAuth: () => store.dispatch(hideAuth()),
}