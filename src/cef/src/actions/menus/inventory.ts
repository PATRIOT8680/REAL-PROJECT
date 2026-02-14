export interface Item {
  id: number
  name: string
  imageId: number
  quantity: number
  maxStack: number
  type: string
  weight: number
  description?: string
  stackable?: boolean
  bagId?: number
  bagWeight?: number
  price?: number,
  isFast?: boolean,

  clothesData?: {
    type: 'clothes' | 'props',
    gender: 'male' | 'female',
    sectionId: number,
    drawable: number,
    texture: number,
    slot: number,
    maxWeight?: number,
  },

  weaponData?: {
    ammoType?: string,
  },

  foodData?: {
    healthRestore?: number,
    eatRestore?: number,
    waterRestore?: number,
  },
}

export interface IHaveBag {
  have: boolean,
  weight?: number
}

export interface IInventoryWeight {
  current: number,
  max: number
}

export interface InventoryState {
  isVisible: boolean
  mainSlots: (Item | null)[]
  bagSlots: (Item | null)[]
  donatSlots: (Item | null)[]
  tradeSlots: (Item | null)[]
  clothesSlots: (Item | null)[]
  returnTradeSlots: (Item | null)[]
  fastSlots: (Item | null)[]
  draggedItem: { item: Item; source: string } | null,
  haveDonatSlots: boolean
  tradeOpen: boolean,
  weight?: IInventoryWeight,
  tradeStatus: string
}

export type typeSlots = 'main' | 'bag' | 'donat' | 'trade' | 'returnTrade' | 'clothes' | 'fast'

export const CLOTHES_SLOT_TYPES = [
  'hat',      // 0: Головной убор
  'jewelry',  // 1: Украшения
  'mask',     // 2: Маска
  'glasses',  // 3: Очки
  'bracelet', // 4: Браслет
  'tshirt',   // 5: Футболка
  'gloves',   // 6: Перчатки
  'armor',    // 7: Бронежилет
  'jacket',   // 8: Куртка/толстовка
  'watch',    // 9: Часы (НОВЫЙ)
  'bag',      // 10: Рюкзак/сумка
  'pants',    // 11: Штаны
  'shoes'     // 12: Обувь
] as const

export const CLOTHES_IMAGE_IDS = {
  HAT: 100,      // Головной убор
  JEWELRY: 101,  // Украшения
  MASK: 102,     // Маска
  GLASSES: 103,  // Очки
  BRACELET: 104, // Браслет
  TSHIRT: 105,   // Футболка
  GLOVES: 106,   // Перчатки
  ARMOR: 107,    // Бронежилет
  JACKET: 108,   // Куртка/толстовка
  WATCH: 112,    // Часы
  BAG: 109,      // Рюкзак/сумка
  PANTS: 110,    // Штаны
  SHOES: 111     // Обувь
} as const

export type ClothesSlotType = typeof CLOTHES_SLOT_TYPES[number]

export const showInventory = (haveDonatSlots: boolean, tradeOpen: boolean) => {
    return {
      type: 'SHOW_INVENTORY' as const,
      payload: { haveDonatSlots, tradeOpen }
    }
}

export const hideInventory = () => {
    return { type: 'HIDE_INVENTORY' as const }
}

export const moveItem = (
  sourceSection: typeSlots,
  sourceSlot: number,
  targetSection: typeSlots,
  targetSlot: number
) => {
  return {
    type: 'MOVE_ITEM' as const,
    payload: { sourceSection, sourceSlot, targetSection, targetSlot }
  }
}

export const addItem = (item: Item, section: typeSlots, slot?: number) => {
  return {
    type: 'ADD_ITEM' as const,
    payload: { item, section, slot },
  }
}

export const removeItem = (section: typeSlots, slot: number) => {
  return {
    type: 'REMOVE_ITEM' as const,
    payload: { section, slot },
  }
}

export const updateItemQuantity = (section: typeSlots, slot: number, quantity: number) => {
  return {
    type: 'UPDATE_ITEM_QUANTITY' as const,
    payload: { section, slot, quantity }
  }
}

export const setDraggedItem = (item: Item | null, source: string | null) => {
  return {
    type: 'SET_DRAGGED_ITEM' as const,
    payload: item && source ? { item, source } : null,
  }
}

export const useItem = (section: typeSlots, slot: number) => {
  return {
    type: 'USE_ITEM' as const,
    payload: { section, slot },
  }
}

export const updateItemIsFast = (itemId: number, isFast: boolean) => ({
  type: 'UPDATE_ITEM_ISFAST' as const,
  payload: { itemId, isFast }
})

export const setTradeStatus = (status: string) => {
  return {
    type: 'SET_TRADE_STATUS' as const,
    payload: status
  }
}

export const setInventory = (
  mainSlots: (Item | null)[],
  bagSlots: (Item | null)[],
  donatSlots: (Item | null)[],
  tradeSlots: (Item | null)[],
  returnTradeSlots: (Item | null)[],
  clothesSlots: (Item | null)[],
  fastSlots: (Item | null)[],
  haveBag?: IHaveBag,
  weight?: IInventoryWeight
) => {
  return {
    type: 'SET_INVENTORY' as const,
    payload: { mainSlots, bagSlots, donatSlots, tradeSlots, returnTradeSlots, clothesSlots, fastSlots, haveBag, weight }
  }
}

export type InventoryAction =
  | ReturnType<typeof showInventory>
  | ReturnType<typeof hideInventory>
  | ReturnType<typeof moveItem>
  | ReturnType<typeof addItem>
  | ReturnType<typeof removeItem>
  | ReturnType<typeof updateItemQuantity>
  | ReturnType<typeof setDraggedItem>
  | ReturnType<typeof useItem>
  | ReturnType<typeof updateItemIsFast>
  | ReturnType<typeof setInventory>
  | ReturnType<typeof setTradeStatus>


export const getClothesSlotType = (imageId: number): ClothesSlotType => {
  switch(imageId) {
    case 100: return 'hat'      // Головной убор
    case 101: return 'jewelry'  // Украшения
    case 102: return 'mask'     // Маска
    case 103: return 'glasses'  // Очки
    case 104: return 'bracelet' // Браслет
    case 105: return 'tshirt'   // Футболка
    case 106: return 'gloves'   // Перчатки
    case 107: return 'armor'    // Бронежилет
    case 108: return 'jacket'   // Куртка/толстовка
    case 112: return 'watch'    // Часы
    case 109: return 'bag'      // Рюкзак/сумка
    case 110: return 'pants'    // Штаны
    case 111: return 'shoes'    // Обувь
    default:
      const index = (imageId - 1) % 13
      return CLOTHES_SLOT_TYPES[Math.max(0, Math.min(index, 12))] || 'hat'
  }
}

export const getClothesIconId = (slotType: ClothesSlotType): number => {
  const iconMap: Record<ClothesSlotType, number> = {
    hat: 1,
    jewelry: 2,
    mask: 3,
    glasses: 4,
    bracelet: 5,
    tshirt: 6,
    gloves: 7,
    armor: 8,
    jacket: 9,
    watch: 10,
    bag: 11,
    pants: 12,
    shoes: 13
  }

  return iconMap[slotType]
}