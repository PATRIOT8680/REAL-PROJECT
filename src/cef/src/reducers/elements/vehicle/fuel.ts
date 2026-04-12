export const fuelVehReducer = (state = { fuel: 20 }, action: any) => {
  switch (action.type) {
    case 'SET_VEH_FUEL':
      return { fuel: action.fuel }
    default:
      return state
  }
}