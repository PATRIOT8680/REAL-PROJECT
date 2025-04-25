import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { rpc } from "../main";

// Menus
import { hideAuth, showAuth } from '../actions/menus/auth'
import { hideChat, showChat } from "../actions/menus/chat";
import { hideLoading, showLoading } from "../actions/menus/loading";

export const visibleMenu = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  // Auth
  rpc.register('cef:showAuth', () => {
    dispatch(showAuth());
  });
  rpc.register('cef:hideAuth', () => {
    dispatch(hideAuth());
  });

  // Chat
  rpc.register('cef:showChat', () => {
    dispatch(showChat())
  })
  rpc.register('cef:hideChat', () => {
    dispatch(hideChat())
  })

  // Loading
  rpc.register('cef:showLoading', (duration: number) => {
    dispatch(showLoading(duration))
  })
  rpc.register('cef:hideLoading', () => {
    dispatch(hideLoading())
  })
}