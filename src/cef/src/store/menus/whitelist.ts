import { store } from "../store";
import { showWhitelist, hideWhitelist } from "../../actions/menus/whitelist.ts";

export const whitelistStore = {
  showWhitelist: (submittedRequest: boolean) => store.dispatch(showWhitelist(submittedRequest)),
  hideAuth: () => store.dispatch(hideWhitelist()),
}