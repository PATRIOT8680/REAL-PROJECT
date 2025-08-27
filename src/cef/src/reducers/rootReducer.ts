import { combineReducers } from 'redux';

import { IDeathPlayer } from './menus/death';

// Menus
import { authReducer } from './menus/auth';
import { chatReducer } from './menus/chat';
import { loadingReducer } from './menus/loading';
import { welcomeReducer } from './menus/welcome';
import { deathReducer } from './menus/death';
import { hudReducer } from "./menus/hud.ts";
import { rentReducer } from "./menus/rent.ts";

// Elements
import { sendNotifyReducer } from './elements/notify'
import { playerInfoReducer } from "./elements/playerInfo"

export type RootState = {
	// Menus
	authReducer: ReturnType<typeof authReducer>
	chatReducer: ReturnType<typeof chatReducer>
  loadingReducer: ReturnType<typeof loadingReducer>
  welcomeReducer: ReturnType<typeof welcomeReducer>
  deathReducer: ReturnType<typeof deathReducer>
  hudReducer: ReturnType<typeof hudReducer>
  rentReducer: ReturnType<typeof rentReducer>

  // Elements
  sendNotifyReducer: ReturnType<typeof sendNotifyReducer>
  playerInfoReducer: ReturnType<typeof playerInfoReducer>
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

  // Elements
  sendNotifyReducer,
  playerInfoReducer,
});