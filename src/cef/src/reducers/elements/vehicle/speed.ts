export const speedVehReducer = (state = { speed: 0 }, action: any) => {
  switch (action.type) {
    case 'SET_VEH_SPEED':
      return { speed: action.speed }
    default:
      return state
  }
}