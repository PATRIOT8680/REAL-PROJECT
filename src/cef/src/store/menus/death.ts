import { store } from "../store";
import { showDeath, hideDeath, selectFateDeath, getFateDeath, setInstant } from "../../actions/menus/death";

export const deathStore = {
  showDeath: (killer: string, instant: 'finish' | 'reborn' | null) => store.dispatch(showDeath(killer, instant)),
  hideDeath: () => store.dispatch(hideDeath()),
  selectFateDeath: (fate: 'ems' | 'death' | null) => store.dispatch(selectFateDeath(fate)),
  getFateDeath: () => store.getState().deathReducer.fate,
  setInstant: (instant: 'finish' | 'reborn' | null) => store.dispatch(setInstant(instant))
}