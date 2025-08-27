interface IData {
  nameCar: string,
  price: number
}

export interface IRentData {
  id: number,
  isTakenRent: boolean,
  data: IData[]
}

export const showRent = (rentData: IRentData) => {
  return { type: 'SHOW_RENT', rentData }
}

export const hideRent = () => {
  return { type: 'HIDE_RENT' }
}