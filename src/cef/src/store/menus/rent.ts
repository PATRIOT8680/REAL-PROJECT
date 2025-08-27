import { store } from "../store";
import { showRent, hideRent, IRentData } from "../../actions/menus/rent.ts";

export const rentStore = {
  showRent: (rentData: IRentData) => store.dispatch(showRent(rentData)),
  hideRent: () => store.dispatch(hideRent()),
}