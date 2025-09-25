import {store} from "../../store.ts";
import { setBufferConsole, getBufferConsole } from "../../../actions/elements/adminMenu/consoleBuffer.ts";
import { ConsoleMessage } from "../../../views/AdminMenu/pages/Console.tsx";

export const consoleBufferStore = {
  setBufferConsole: (msgs: ConsoleMessage[]) => store.dispatch(setBufferConsole(msgs)),
  getBufferConsole: () => store.dispatch(getBufferConsole()),
}