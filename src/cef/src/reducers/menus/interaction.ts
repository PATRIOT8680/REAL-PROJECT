const initialState = {
  isVisible: false,
  typeEntity: 'vehicle',
  targetId: 12,
}

export const interactionReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_INTERACTION':
      return {
        isVisible: true,
        typeEntity: action.typeEntity,
        targetId: action.targetId
      }
    case 'HIDE_INTERACTION':
      return {
        isVisible: false,
        typeEntity: undefined,
        targetId: null
      }
    default:
      return state
  }
}