import { createStore } from "redux";
import { rootReducer } from "../reducers/rootReducer";

// Menus
import { authStore } from "./menus/auth";
import { chatStore } from "./menus/chat";
import { loadingStore } from "./menus/loading";
import { welcomeStore } from "./menus/welcome";
import { deathStore } from "./menus/death";
import { hudStore } from "./menus/hud.ts";
import { rentStore } from "./menus/rent.ts";
import { selectCharStore } from "./menus/select-char.ts";
import { createCharStore } from "./menus/create-char.ts";
import { adminMenuStore } from "./menus/adminMenu.ts";
import { playerReportsStore } from "./menus/playerReports.ts";

// Elements
import { sendNotifyStore } from "./elements/notify";
import { playerInfoStore } from "./elements/playerInfo.ts";
import { cashStore } from "./elements/cash.ts";
import { bankMoneyStore } from "./elements/bankMoney.ts";
import { donatCoinsStore } from "./elements/donatcoins.ts";
import { consoleBufferStore } from "./elements/adminMenu/consoleBuffer.ts";
import { reportsListStore } from "./elements/adminMenu/reportsList.ts";

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
  rentReducer: rentStore,
  selectCharReducer: selectCharStore,
  createCharReducer: createCharStore,
  adminMenuReducer: adminMenuStore,
  playerReportsReducer: playerReportsStore,

  // Elements
  sendNotifyReducer: sendNotifyStore,
  playerInfoReducer: playerInfoStore,
  cashReducer: cashStore,
  bankMoneyReducer: bankMoneyStore,
  donatCoinsReducer: donatCoinsStore,
  consoleBufferReducer: consoleBufferStore,
  reportsListReducer: reportsListStore,
};