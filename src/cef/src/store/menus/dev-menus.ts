import { store } from "../store";
import { showNewRent, hideNewRent } from "../../actions/menus/dev-menus/newRent.ts";
import { showCreateBusiness, hideCreateBusiness } from "../../actions/menus/dev-menus/createBusiness.ts";

export const devMenusStore = {
  showNewRent: () => store.dispatch(showNewRent()),
  hideNewRent: () => store.dispatch(hideNewRent()),
  showCreateBusiness: () => store.dispatch(showCreateBusiness()),
  hideCreateBusiness: () => store.dispatch(hideCreateBusiness()),
}