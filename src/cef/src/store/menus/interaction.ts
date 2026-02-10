import { store } from "../store.ts";
import { showInteraction, hideInteraction } from "../../actions/menus/interaction.ts";

export const interactionStore = {
  showInteraction: (typeEntity: 'player' | 'vehicle', targetId: number | null) => store.dispatch(showInteraction(typeEntity, targetId)),
  hideInteraction: () => store.dispatch(hideInteraction()),
}