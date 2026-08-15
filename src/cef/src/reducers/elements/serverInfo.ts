<<<<<<< HEAD
import { IConnectedUser } from "../../../../shared/types/connectedUsers.ts";

export interface IServerInfo {
  online: number,
  playersData: IConnectedUser[]
=======
export interface IServerInfo {
  online: number
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

const initialState: IServerInfo = {
  online: 0,
<<<<<<< HEAD
  playersData: [
    /*{
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 5,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },
    {
      sid: 0,
      login: 'jonson',
      uid: 124321,
      nickName: 'William Blade',
      gender: 'male',
      adminLvl: 0,
      age: 24,
      cash: 15934,
      bankmoney: 245600,
      donatcoins: 1459,
      lvl: 4,
      exp: 2,
      unique_quest: null
    },*/
  ]
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

export const serverInfoReducer = (state: IServerInfo = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ONLINE':
      return { ...state, online: action.online }
<<<<<<< HEAD
    case 'SET_PLAYERS_DATA':
      return { ...state, playersData: action.playersData }
    case 'ADD_PLAYER_DATA':
      return {
        ...state,
        playersData: [...state.playersData, action.player],
        online: state.online + 1,
      }
    case 'REMOVE_PLAYER_DATA':
      return {
        ...state,
        playersData: state.playersData.filter(p => p.uid !== action.uid),
        online: Math.max(0, state.online - 1)
      }
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
    default:
      return state
  }
}