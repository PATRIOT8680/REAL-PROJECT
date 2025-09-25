import { store } from "../store";
import { showAdminMenu, hideAdminMenu } from "../../actions/menus/adminMenu.ts";

export const adminMenuStore = {
  showAdminMenu: () => store.dispatch(showAdminMenu()),
  hideAdminMenu: () => store.dispatch(hideAdminMenu()),
}