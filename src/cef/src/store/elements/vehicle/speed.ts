import { setSpeed } from "../../../actions/elements/vehicle/speed.ts";
import { setEngine } from "../../../actions/elements/vehicle/engine.ts";
import { setDoors } from "../../../actions/elements/vehicle/doors.ts";
import { setSeatBelt } from "../../../actions/elements/vehicle/seatBelt.ts";
import { store } from "../../store.ts";

export const speedVehStore = {
  setSpeed: (speed: number) => store.dispatch(setSpeed(speed)),
  setEngine: (engine: boolean) => store.dispatch(setEngine(engine)),
  setDoors: (doors: boolean) => store.dispatch(setDoors(doors)),
  setSeatBelt: (seatBelt: boolean) => store.dispatch(setSeatBelt(seatBelt)),
}