import { TypeNotify, TypePos } from "../../actions/elements/notify"

export interface INotify {
  id: string,
  typeNotify: TypeNotify,
  msg: string,
  duration: number,
  pos: TypePos
}

const initialState: INotify = {
  id: '',
  typeNotify: 'info',
  msg: '',
  duration: 5000,
  pos: 'bottom'
};

export const sendNotifyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SEND_NOTIFY':
      return {
        id: action.id,
        typeNotify: action.typeNotify || 'info',
        msg: action.msg || 'Сообщение отсутствует',
        duration: action.duration || 5000,
        pos: action.pos || 'bottom'
      }
    default:
      return state;
  }
};