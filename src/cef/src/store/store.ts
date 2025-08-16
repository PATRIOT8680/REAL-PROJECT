import { createStore } from "redux";
import { rootReducer } from "../reducers/rootReducer";

// Menus
import { authStore } from "./menus/auth";
import { chatStore } from "./menus/chat";
import { loadingStore } from "./menus/loading";
import { welcomeStore } from "./menus/welcome";
import { deathStore } from "./menus/death";
import { hudStore } from "./menus/hud.ts";

// Elements
import { sendNotifyStore } from "./elements/notify";
import { playerInfoStore } from "./elements/playerInfo.ts";

export const store = createStore(rootReducer);

declare global {
  interface Window {
    App: any;
  }
}

window.App = {
  // Menus
  authReducer: authStore,
  chatReducer: chatStore,
  loadingReducer: loadingStore,
  welcomeReducer: welcomeStore,
  deathReducer: deathStore,
  hudReducer: hudStore,

  // Elements
  sendNotifyReducer: sendNotifyStore,
  playerInfoReducer: playerInfoStore,
};