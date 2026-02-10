import { store } from "../store";
import { showOffer, hideOffer } from "../../actions/menus/offer.ts";

export const offerStore = {
  showOffer: (
    title: string,
    description: string,
    duration: number
  ) => store.dispatch(showOffer(title, description, duration)),
  hideOffer: () => store.dispatch(hideOffer()),
}