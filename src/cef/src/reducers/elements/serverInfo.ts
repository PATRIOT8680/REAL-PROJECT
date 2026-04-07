export interface IServerInfo {
  online: number
}

const initialState: IServerInfo = {
  online: 0,
}

export const serverInfoReducer = (state: IServerInfo = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ONLINE':
      return { ...state, online: action.online }
    default:
      return state
  }
}