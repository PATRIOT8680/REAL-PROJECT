import { createContext, useContext, ReactNode, FC, Dispatch, useReducer } from "react";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { sendNotify, removeNotify, TypeNotify, TypePos } from "../../actions/elements/notify";
import { INotify, sendNotifyReducer } from "../../reducers/elements/notify";

import Notify from "./Notify";
import './assets/styles/compiled-css/Notify.css'

interface IAddNotify {
  type: 'ADD_NOTIFY',
  payload: INotify
}

interface IRemoveNotify {
  type: 'REMOVE_NOTIFY',
  id: string
}

type NotifyAction = IAddNotify | IRemoveNotify

const NotifyContext = createContext<Dispatch<NotifyAction> | null>(null)


const NotifyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer((state: INotify[], action: NotifyAction) => {
    switch (action.type) {
      case "ADD_NOTIFY":
        const samePosNotes = state.filter(note => note.pos === action.payload.pos);
        if (samePosNotes.length >= 4) {
          const oldestNotification = samePosNotes[0];
          return [
            ...state.filter(note => note.id !== oldestNotification.id),
            { ...action.payload }
          ];
        }
        return [...state, { ...action.payload }];
      case "REMOVE_NOTIFY":
        return state.filter((el) => el.id !== action.id);
      default:
        return state;
    }
  }, []);

  const notifyByPos = state.reduce((acc, note) => {
    if (!acc[note.pos]) {
      acc[note.pos] = []
    }
    acc[note.pos].push(note)
    return acc
  }, {} as Record<string, INotify[]>)

  return(
    <NotifyContext.Provider value={dispatch}>
      <div className="notify-wrapper">
        { Object.keys(notifyByPos).map((pos, index) => (
          <div key={index} className={`notify-container pos-${pos}`}>
            { notifyByPos[pos].map((note) => (
              <Notify dispatch={dispatch} key={note.id} {...note} />
            )) }
          </div>
        )) }
      </div>
      {children}
    </NotifyContext.Provider>
  )
}


export const useNotify = () => {
  const context = useContext(NotifyContext)

  if (!context) {
    throw new Error("useNotification должен использоваться внутри NotificationProvider!");
  }

  const addNotify = (props: Pick<INotify, 'typeNotify' | 'msg' | 'duration' | 'pos'>) => {
    context({
      type: 'ADD_NOTIFY',
      payload: {
        id: v4(),
        typeNotify: props.typeNotify,
        msg: props.msg,
        duration: props.duration || 5000,
        pos: props.pos
      },
    })
  }

  return addNotify
}

export default NotifyProvider