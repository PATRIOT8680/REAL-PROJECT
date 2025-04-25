import { combineReducers } from 'redux';

// Menus
import { authReducer } from './menus/auth';
import { chatReducer } from './menus/chat';
import { loadingReducer } from './menus/loading';

// Elements
import { sendNotifyReducer } from './elements/notify';

export type RootState = {
	// Menus
	authReducer: ReturnType<typeof authReducer>
	chatReducer: ReturnType<typeof chatReducer>
  loadingReducer: ReturnType<typeof loadingReducer>
  sendNotifyReducer: ReturnType<typeof sendNotifyReducer>
}

export const rootReducer = combineReducers({
  // Menus
  authReducer,
  chatReducer,
  loadingReducer,

  // Elements
  sendNotifyReducer
});