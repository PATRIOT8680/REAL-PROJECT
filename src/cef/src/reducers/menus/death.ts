export interface IDeathPlayer {
  isVisible: boolean,
  fate: 'ems' | 'death' | null,
  instant: 'finish' | 'reborn' | null
}

export const deathReducer = (state: IDeathPlayer = { isVisible: false, fate: null, instant: null }, action: any) => {
  switch (action.type) {
    case 'SHOW_DEATH':
      return {
        isVisible: true, 
        fate: null,
        instant: action.instant,
        killer: action.killer
      }
    case 'HIDE_DEATH':
      return { isVisible: false }
    case 'SELECT_FATE':
      return { 
        ...state,
        fate: action.fate
      }
    case 'GET_FATE':
      return state
    case 'SET_INSTANT':
      return { 
        ...state,
        instant: action.instant 
      }
    default:
      return state
  }
}