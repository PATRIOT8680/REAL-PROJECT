import {store} from "../store.ts";
import { setHover, removeHover } from "../../actions/elements/hoverInteraction.ts";

export const hoverInteractionStore = {
  setHover: () => store.dispatch(setHover()),
  removeHover: () => store.dispatch(removeHover()),
}