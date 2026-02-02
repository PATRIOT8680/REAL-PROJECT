export interface ICarData {
  nameCar: string,
  type: string,
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
      nameCar: 'khanjo',
      type: 'car',
      price: 100
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