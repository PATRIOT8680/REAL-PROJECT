import { store } from "../store.ts";
import { showHud, hideHud, setBindsVisible, setHintVisible, setStreet, setArea } from "../../actions/menus/hud.ts";

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
  setBindsVisible: (visible: boolean) => store.dispatch(setBindsVisible(visible)),
  setHintVisible: (visible: boolean) => store.dispatch(setHintVisible(visible)),
  setStreet: (street: string) => store.dispatch(setStreet(street)),
  setArea: (area: string) => store.dispatch(setArea(area))
}