export interface IPlayerInfo {
  sid: number,
  id: number,
  uid: number,
  nickname: string,
  eat: number,
  water: number
<<<<<<< HEAD
  health: number,
  adminlvl: number,
  cardNumber: number | null,
=======
  health: number
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

const initialState = {
  sid: 0,
  id: 0,
  uid: 0,
  nickname: '',
  eat: 50,
  water: 100,
  health: 100,
<<<<<<< HEAD
  adminlvl: 3,
  cardNumber: null,
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

export const playerInfoReducer = (state: IPlayerInfo = initialState, action: any) => {
  switch (action.type) {
    case 'SET_SID':
      return { ...state, sid: action.sid }
    case 'SET_ID':
      return { ...state, id: action.id }
    case 'SET_UID':
      return { ...state, uid: action.uid }
    case 'SET_NICKNAME':
      return { ...state, nickname: action.nickname }
    case 'SET_EAT':
      return {...state, eat: action.eat }
    case 'SET_WATER':
      return { ...state, water: action.water }
    case 'SET_HEALTH':
      return { ...state, health: action.health }
<<<<<<< HEAD
    case 'SET_ADMIN_LVL':
      return { ...state, adminlvl: action.lvl }
    case 'SET_CARD_NUMBER':
      return { ...state, cardNumber: action.cardNumber }
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
    default:
      return state
  }
}