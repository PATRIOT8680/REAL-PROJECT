import { store } from "../store";
import { showLoading, hideLoading } from "../../actions/menus/loading";

export const loadingStore = {
  showLoading: (duration: number) => store.dispatch(showLoading(duration)),
  hideLoading: () => store.dispatch(hideLoading()),
}