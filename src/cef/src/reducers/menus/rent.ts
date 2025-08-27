export interface ICarData {
  nameCar: string,
  price: number
}

export interface IRentData {
  isVisible: boolean,
  id: number,
  isTakenRent: boolean,
  data: ICarData[]
}

const initialState = {
  isVisible: false,
  id: 0,
  isTakenRent: false,
  data: [
    {
      nameCar: '',
      price: 0
    },
  ]
}

export const rentReducer = (state: IRentData = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_RENT':
      return {
        isVisible: true,
        id: action.rentData.id,
        isTakenRent: action.rentData.isTakenRent,
        data: action.rentData.data
      }
    case 'HIDE_RENT':
      return { isVisible: false }
    default:
      return state
  }
}