import {store} from "../store.ts";
import { visibleHover, setHover, removeHover } from "../../actions/elements/hoverInteraction.ts";

export const hoverInteractionStore = {
  visibleHover: (isVisible: boolean) => store.dispatch(visibleHover(isVisible)),
  setHover: () => store.dispatch(setHover()),
  removeHover: () => store.dispatch(removeHover()),
}