import { combineReducers } from 'redux';

// Menus
import { authReducer } from './menus/auth';
import { chatReducer } from './menus/chat';
import { loadingReducer } from './menus/loading';
import { welcomeReducer } from './menus/welcome';
import { deathReducer } from './menus/death';
import { hudReducer } from "./menus/hud.ts";
import { rentReducer } from "./menus/rent.ts";
import { selectCharReducer } from './menus/select-char.ts';
import { createCharReducer } from './menus/create-char.ts';
import { adminMenuReducer } from "./menus/adminMenu.ts";
import { playerReportsReducer } from "./menus/playerReports.ts";
import { spawnReducer } from "./menus/spawn.ts";
import { inventoryReducer } from "./menus/inventory.ts";
import { waitingLoaderReducer } from "./menus/waitingLoader.ts";
import { interactionReducer } from "./menus/interaction.ts";
import { offerReducer } from "./menus/offer.ts";
import { devMenusReducer } from "./menus/dev-menus.ts";
import { shop24Reducer } from "./menus/shop24.ts";
import { buyingBusinessReducer } from "./menus/buyingBusiness.ts";

// Elements
import { sendNotifyReducer } from './elements/notify'
import { playerInfoReducer } from "./elements/playerInfo"
import { cashReducer } from "./elements/player/cash.ts"
import { bankMoneyReducer } from "./elements/player/bankMoney.ts"
import { donatCoinsReducer } from "./elements/player/donatcoins.ts"
import { consoleBufferReducer } from "./elements/adminMenu/consoleBuffer.ts";
import { reportReducer } from "./elements/adminMenu/reportsList.ts";
import { hoverInteractionReducer } from "./elements/hoverInteraction.ts";
import { speedVehReducer } from "./elements/vehicle/speed.ts";
import { serverInfoReducer } from "./elements/serverInfo.ts";
import { fuelVehReducer } from "./elements/vehicle/fuel.ts";

export type RootState = {
	// Menus
	authReducer: ReturnType<typeof authReducer>
	chatReducer: ReturnType<typeof chatReducer>
  loadingReducer: ReturnType<typeof loadingReducer>
  welcomeReducer: ReturnType<typeof welcomeReducer>
  deathReducer: ReturnType<typeof deathReducer>
  hudReducer: ReturnType<typeof hudReducer>
  rentReducer: ReturnType<typeof rentReducer>
  selectCharReducer: ReturnType<typeof selectCharReducer>
  createCharReducer: ReturnType<typeof createCharReducer>
  adminMenuReducer: ReturnType<typeof adminMenuReducer>
  playerReportsReducer: ReturnType<typeof playerReportsReducer>
  spawnReducer: ReturnType<typeof spawnReducer>
  inventoryReducer: ReturnType<typeof inventoryReducer>
  waitingLoaderReducer: ReturnType<typeof waitingLoaderReducer>
  interactionReducer: ReturnType<typeof interactionReducer>
  offerReducer: ReturnType<typeof offerReducer>
  devMenusReducer: ReturnType<typeof devMenusReducer>
  shop24Reducer: ReturnType<typeof shop24Reducer>
  buyingBusinessReducer: ReturnType<typeof buyingBusinessReducer>

  // Elements
  sendNotifyReducer: ReturnType<typeof sendNotifyReducer>
  playerInfoReducer: ReturnType<typeof playerInfoReducer>
  cashReducer: ReturnType<typeof cashReducer>
  bankMoneyReducer: ReturnType<typeof bankMoneyReducer>
  donatCoinsReducer: ReturnType<typeof donatCoinsReducer>
  consoleBufferReducer: ReturnType<typeof consoleBufferReducer>
  reportReducer: ReturnType<typeof reportReducer>
  hoverInteractionReducer: ReturnType<typeof hoverInteractionReducer>
  speedVehReducer: ReturnType<typeof speedVehReducer>
  serverInfoReducer: ReturnType<typeof serverInfoReducer>
  fuelVehReducer: ReturnType<typeof fuelVehReducer>
}

export const rootReducer = combineReducers({
  // Menus
  authReducer,
  chatReducer,
  loadingReducer,
  welcomeReducer,
  deathReducer,
  hudReducer,
  rentReducer,
  selectCharReducer,
  createCharReducer,
  adminMenuReducer,
  playerReportsReducer,
  spawnReducer,
  inventoryReducer,
  waitingLoaderReducer,
  interactionReducer,
  offerReducer,
  devMenusReducer,
  shop24Reducer,
  buyingBusinessReducer,

  // Elements
  sendNotifyReducer,
  playerInfoReducer,
  cashReducer,
  bankMoneyReducer,
  donatCoinsReducer,
  consoleBufferReducer,
  reportReducer,
  hoverInteractionReducer,
  speedVehReducer,
  serverInfoReducer,
  fuelVehReducer
});