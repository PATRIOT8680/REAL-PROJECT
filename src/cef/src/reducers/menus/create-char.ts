export interface ICreateChar {
  isVisible: boolean,
  sid: number,
  numberSlot: number
}

export const createCharReducer = (state: ICreateChar = { isVisible: false, sid: 0, numberSlot: 0 }, action: any) => {
  switch (action.type) {
    case 'SHOW_CREATE_CHAR':
      return {
        isVisible: true,
        sid: action.sid,
        numberSlot: action.numberSlot
      }
    case 'HIDE_CREATE_CHAR':
      return { isVisible: false }
    default:
      return state
  }
}