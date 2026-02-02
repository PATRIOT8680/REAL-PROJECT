import { setSpeed } from "../../../actions/elements/vehicle/speed.ts";
import { store } from "../../store.ts";

export const speedVehStore = {
  setSpeed: (speed: number) => store.dispatch(setSpeed(speed))
}