export interface ICarData {
  fullNameCar: string,
  keyNameCar: string,
  type: string,
  price: number
}

export interface IRentData {
  id: number,
  isTakenRent: boolean,
  data: ICarData[]
}

export const showRent = (rentData: IRentData) => {
  return { type: 'SHOW_RENT', rentData }
}

export const hideRent = () => {
  return { type: 'HIDE_RENT' }
}