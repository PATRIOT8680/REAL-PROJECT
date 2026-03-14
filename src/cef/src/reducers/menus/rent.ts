import { ICarData } from "../../../../shared/types/rent.ts";

export interface IRentData {
  isVisible: boolean,
  id: number,
  isTakenRent: boolean,
  data: ICarData[]
}

const initialState = {
  isVisible: false,
  id: 0,
  isTakenRent: true,
  data: [
    {
      fullNameCar: 'Nero test',
      keyNameCar: 'nero2',
      type: 'car',
      price: 100,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Zentorno',
      keyNameCar: 'zentorno',
      type: 'car',
      price: 150,
      typeFuel: 'gas',
    },
    {
      fullNameCar: 'Faggio test',
      keyNameCar: 'faggio',
      type: 'moto',
      price: 1200,
      typeFuel: 'electro',
    },
    {
      fullNameCar: 'Faggio 2 test',
      keyNameCar: 'faggio2',
      type: 'moto',
      price: 480,
      typeFuel: 'electro',
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