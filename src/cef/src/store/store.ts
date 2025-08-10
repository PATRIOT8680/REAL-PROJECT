import { createStore } from "redux";
import { rootReducer } from "../reducers/rootReducer";

// Menus
import { authStore } from "./menus/auth";
import { chatStore } from "./menus/chat";
import { loadingStore } from "./menus/loading";
import { welcomeStore } from "./menus/welcome";
import { deathStore } from "./menus/death";

// Elements
import { sendNotifyStore } from "./elements/notify";

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

  // Elements
  sendNotifyReducer: sendNotifyStore
};