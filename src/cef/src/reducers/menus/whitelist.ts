export interface IWhitelist {
  isVisible: boolean,
  submittedRequest: boolean
}

const initialState: IWhitelist = {
  isVisible: false,
  submittedRequest: false
}

export const whitelistReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_WHITELIST':
      return {
        isVisible: true,
        submittedRequest: action.submittedRequest
      }
    case 'HIDE_AUTH':
      return {
        ...state,
        isVisible: false,
      }
    default:
      return state
  }
}