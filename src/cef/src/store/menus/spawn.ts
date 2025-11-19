import { store } from "../store";
import { showSpawn, hideSpawn } from "../../actions/menus/spawn.ts";
import { ISelectChar } from "../../actions/menus/select-char.ts";

export const spawnStore = {
  showSpawn: (
      selectedSlot: number,
      nickName: string
  ) => store.dispatch(showSpawn(selectedSlot, nickName)),
  hideSpawn: () => store.dispatch(hideSpawn()),
}