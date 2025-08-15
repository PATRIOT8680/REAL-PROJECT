import { store } from "../store.ts";

import { setSid } from "../../actions/elements/playerInfo/sid";
import { setID } from "../../actions/elements/playerInfo/id.ts";

export const playerInfoStore = {
  setSid: (sid: number) => store.dispatch(setSid(sid)),
  setID: (id: number) => store.dispatch(setID(id)),
}