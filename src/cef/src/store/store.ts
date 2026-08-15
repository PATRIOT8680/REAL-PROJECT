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
import { spawnStore } from "./menus/spawn.ts";
import { inventoryStore, setStore } from "./menus/inventory.ts";
import { waitingLoaderStore } from "./menus/waitingLoader.ts";
import { interactionStore } from "./menus/interaction.ts";
import { offerStore } from "./menus/offer.ts";
import { devMenusStore } from "./menus/dev-menus.ts";
import { shop24Store } from "./menus/shop24.ts";
import { buyingBusinessStore } from "./menus/buyingBusiness.ts";
import { whitelistStore } from "./menus/whitelist.ts";
import { bankStore } from "./menus/bank.ts";

// Elements
import { sendNotifyStore } from "./elements/notify";
import { playerInfoStore } from "./elements/playerInfo.ts";
import { cashStore } from "./elements/cash.ts";
import { bankMoneyStore } from "./elements/bankMoney.ts";
import { donatCoinsStore } from "./elements/donatcoins.ts";
import { consoleBufferStore } from "./elements/adminMenu/consoleBuffer.ts";
import { reportsListStore } from "./elements/adminMenu/reportsList.ts";
import { hoverInteractionStore } from "./elements/hoverInteraction.ts";
import { speedVehStore } from "./elements/vehicle/speed.ts";
import { serverInfoStore } from "./elements/serverInfo.ts";
import { fuelVehStore } from "./elements/vehicle/fuel.ts";

export const store = createStore(rootReducer);

setStore(store)

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
  spawnReducer: spawnStore,
  inventoryReducer: inventoryStore,
  waitingLoaderReducer: waitingLoaderStore,
  interactionReducer: interactionStore,
  offerReducer: offerStore,
  devMenusReducer: devMenusStore,
  shop24Reducer: shop24Store,
  buyingBusinessReducer: buyingBusinessStore,
  whitelistReducer: whitelistStore,
  bankReducer: bankStore,

  // Elements
  sendNotifyReducer: sendNotifyStore,
  playerInfoReducer: playerInfoStore,
  cashReducer: cashStore,
  bankMoneyReducer: bankMoneyStore,
  donatCoinsReducer: donatCoinsStore,
  consoleBufferReducer: consoleBufferStore,
  reportsListReducer: reportsListStore,
  hoverInteractionReducer: hoverInteractionStore,
  speedVehReducer: speedVehStore,
  serverInfoReducer: serverInfoStore,
  fuelVehReducer: fuelVehStore,
}