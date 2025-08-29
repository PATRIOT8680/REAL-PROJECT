import { store } from "../store";
import { ISelectChar } from "../../actions/menus/select-char";
import { showSelectChar, hideSelectChar } from "../../actions/menus/select-char";

export const selectCharStore = {
  showSelectChar: (char1: ISelectChar, char2: ISelectChar, char3: ISelectChar, char4: ISelectChar, char5: ISelectChar) =>
      store.dispatch(showSelectChar(char1, char2, char3, char4, char5)),
  hideSelectChar: () => store.dispatch(hideSelectChar()),
}