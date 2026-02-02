import { store } from "../store";
import { showWaitingLoader, hideWaitingLoader } from "../../actions/menus/waitingLoader.ts";

export const waitingLoaderStore = {
  showWaitingLoader: (duration: number, subtitle: string) => store.dispatch(showWaitingLoader(duration, subtitle)),
  hideWaitingLoader: () => store.dispatch(hideWaitingLoader()),
}