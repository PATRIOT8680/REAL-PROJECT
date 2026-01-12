export interface IPlayerInfo {
  sid: number,
  id: number,
  nickname: string,
  eat: number,
  water: number
  health: number
}

const initialState = {
  sid: 0,
  id: 0,
  nickname: '',
  eat: 50,
  water: 100,
  health: 100,
}

export const playerInfoReducer = (state: IPlayerInfo = initialState, action: any) => {
  switch (action.type) {
    case 'SET_SID':
      return { ...state, sid: action.sid }
    case 'SET_ID':
      return { ...state, id: action.id }
    case 'SET_NICKNAME':
      return { ...state, nickname: action.nickname }
    case 'SET_EAT':
      return {...state, eat: action.eat }
    case 'SET_WATER':
      return { ...state, water: action.water }
    case 'SET_HEALTH':
      return { ...state, health: action.health }
    default:
      return state
  }
}