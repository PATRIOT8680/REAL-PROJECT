const initialState = {
  speed: 180,
  engine: false,
  doors: false,
  seatBelt: false
}

export const speedVehReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_VEH_SPEED':
      return { ...state, speed: action.speed }
    case 'SET_STATE_VEH_DOORS':
      return { ...state, doors: action.doors }
    case 'SET_STATE_VEH_ENGINE':
      return { ...state, engine: action.engine }
    case 'SET_STATE_VEH_SEATBELT':
      return { ...state, seatBelt: action.seatBelt }
    default:
      return state
  }
}