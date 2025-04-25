import { store } from "../store";
import { showChat, hideChat } from "../../actions/menus/chat";

export const chatStore = {
  showChat: () => store.dispatch(showChat()),
  hideChat: () => store.dispatch(hideChat()),
}