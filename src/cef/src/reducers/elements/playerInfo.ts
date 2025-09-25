export interface IPlayerInfo {
  sid: number,
  id: number,
  nickname: string,
}

export const playerInfoReducer = (state: IPlayerInfo = { sid: 0, id: 0, nickname: '' }, action: any) => {
  switch (action.type) {
    case 'SET_SID':
      return { ...state, sid: action.sid }
    case 'SET_ID':
      return { ...state, id: action.id }
    case 'SET_NICKNAME':
      return { ...state, nickname: action.nickname }
    default:
      return state
  }
}