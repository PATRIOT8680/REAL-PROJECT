import { ICarData } from "../../../../shared/types/rent.ts";

export interface IRentData {
  id: number,
  isTakenRent: boolean,
  data: ICarData[]
}

export const showRent = (rentData: IRentData) => {
  return { type: 'SHOW_RENT', rentData }
}

export const setIsTakenRent = (state: boolean) => {
  return { type: 'SET_IS_TAKEN_RENT', state }
}

export const hideRent = () => {
  return { type: 'HIDE_RENT' }
}