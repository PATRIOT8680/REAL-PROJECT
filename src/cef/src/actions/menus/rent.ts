import { ICarData } from "../../../../shared/types/rent.ts";

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