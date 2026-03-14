import { store } from "../store.ts";
import { showHud, hideHud } from "../../actions/menus/hud.ts";

export const hudStore = {
  showHud: (
    speedometerVisible?: boolean,
    rightX?: number,
    leftX?: number,
    topY?: number,
    bottomY?: number,
    width?: number,
    height?: number,
  ) => store.dispatch(showHud(speedometerVisible, rightX, leftX, topY, bottomY, width, height)),
  hideHud: () => store.dispatch(hideHud()),
}