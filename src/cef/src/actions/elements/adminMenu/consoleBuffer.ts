import { ConsoleMessage } from "../../../views/AdminMenu/pages/Console.tsx";

export const setBufferConsole = (msgs: ConsoleMessage[]) => {
  return { type: 'SET_BUFFER_CONSOLE', payload: msgs }
}

export const getBufferConsole = () => {
  return { type: 'GET_BUFFER_CONSOLE' }
}