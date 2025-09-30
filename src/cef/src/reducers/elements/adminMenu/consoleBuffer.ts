import { ConsoleMessage } from "../../../views/AdminMenu/pages/Console.tsx";
import {getDateTime} from "../../../modules/dateTime.ts";

const currentDateTime = await getDateTime()

const initialState: any[] = [
]

export const consoleBufferReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_BUFFER_CONSOLE':
      return action.payload
    case 'GET_BUFFER_CONSOLE':
      return state
    default:
      return state
  }
}