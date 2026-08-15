import { store } from "../store.ts";

import { setSid } from "../../actions/elements/playerInfo/sid";
import { setID } from "../../actions/elements/playerInfo/id.ts";
import { setUid } from "../../actions/elements/playerInfo/uid.ts";
import { setNickname } from "../../actions/elements/playerInfo/nickname.ts";
import { setEat } from "../../actions/elements/playerInfo/eat.ts";
import { setWater } from "../../actions/elements/playerInfo/water.ts";
import { setHealth } from "../../actions/elements/playerInfo/health.ts";
import { setAdminLvl } from "../../actions/elements/playerInfo/adminLvl.ts";
import { setCardNumber } from "../../actions/elements/playerInfo/cardNumber.ts";

export const playerInfoStore = {
  setSid: (sid: number) => store.dispatch(setSid(sid)),
  setID: (id: number) => store.dispatch(setID(id)),
  setUid: (uid: number) => store.dispatch(setUid(uid)),
  setNickname: (nickname: string) => store.dispatch(setNickname(nickname)),
  setEat: (eat: number) => store.dispatch(setEat(eat)),
  setWater: (water: number) => store.dispatch(setWater(water)),
  setHealth: (health: number) => store.dispatch(setHealth(health)),
  setAdminLvl: (lvl: number) => store.dispatch(setAdminLvl(lvl)),
  setCardNumber: (cardNumber: number) => store.dispatch(setCardNumber(cardNumber)),
}