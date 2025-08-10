import { store } from "../store";
import { sendNotify, TypeNotify, TypePos } from "../../actions/elements/notify";

export const sendNotifyStore = {
  sendNotify: (typeNotify: TypeNotify, msg: string, duration: number, pos: TypePos) => 
    store.dispatch(sendNotify(typeNotify, msg, duration, pos)),
}