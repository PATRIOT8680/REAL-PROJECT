import { store } from "../store.ts";
import { setOnline } from "../../actions/elements/serverInfo/online.ts";

export const serverInfoStore = {
  setOnline: (online: number) => store.dispatch(setOnline(online)),
}