import { store } from "../../store.ts";
import { setFuel } from "../../../actions/elements/vehicle/fuel.ts";

export const fuelVehStore = {
  setFuel: (fuel: number) => store.dispatch(setFuel(fuel))
}