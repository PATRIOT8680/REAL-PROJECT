import { store } from "../store";
import { showCreateChar, hideCreateChar } from "../../actions/menus/create-char";

export const createCharStore = {
  showCreateChar: (sid: number, numberSlot: number) => store.dispatch(showCreateChar(sid, numberSlot)),
  hideCreateChar: () => store.dispatch(hideCreateChar()),
}