export interface BusinessData {
  id: number,
  owner: string,
  type: BusinessType,
  name: string,
  price: number,
  markup: number,
  balance: number,
  position: Vector3,
  taxAccumulated: number, // Накопленный налог за неделю
  lastHourlyExpense: Date, // Дата последнего списания расходов (каждый час)
  taxDeadline: Date, // До какой даты нужно оплатить налог (7 дней)
  lastBalanceZero: Date | null // Когда последний раз баланс стал 0 (для отъема)
  createdAt: Date,
  updatedAt: Date
}

export enum BusinessType {
  SHOP24 = 'shop24',
  GAS_STATION = 'gas_station',
  CLOTHES_SHOP = 'clothes_shop',
  CAR_SHOWROOM = 'car_showroom'
}

export const BusinessNames: Record<BusinessType, string> = {
  [BusinessType.SHOP24]: 'QuickStop 24/7',
  [BusinessType.GAS_STATION]: 'Заправка Thunder',
  [BusinessType.CLOTHES_SHOP]: 'Магазин одежды Style Forge',
  [BusinessType.CAR_SHOWROOM]: 'Автосалон Velocity'
} as const

export const BusinessBlipConfig: Record<BusinessType, {
  sprite: number,
  scale: number,
  color: number,
  alpha?: number,
  shortRange: boolean
}> = {
  [BusinessType.SHOP24]: {
    sprite: 52,
    scale: 0.8,
    color: 11,
    alpha: 255,
    shortRange: true
  },
  [BusinessType.GAS_STATION]: {
    sprite: 361,
    scale: 0.8,
    color: 35,
    alpha: 255,
    shortRange: true
  },
  [BusinessType.CLOTHES_SHOP]: {
    sprite: 73,
    scale: 0.8,
    color: 8,
    alpha: 255,
    shortRange: true
  },
  [BusinessType.CAR_SHOWROOM]: {
    sprite: 810,
    scale: 0.8,
    color: 9,
    alpha: 255,
    shortRange: true
  },
}

export interface CreateBusinessDto {
  type: BusinessType,
  position: Vector3,
  price: number,
  balance: number,
  markup?: number,
}

export type BusinessOwner = number | 'gov'