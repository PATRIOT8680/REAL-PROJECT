export interface IPlayerInfo {
  sid: number,
  id: number
}

export const playerInfoReducer = (state: IPlayerInfo = { sid: 0, id: 0 }, action: any) => {
  switch (action.type) {
    case 'SET_SID':
      return { ...state, sid: action.sid }
    case 'SET_ID':
      return { ...state, id: action.id }
    default:
      return state
  }
}