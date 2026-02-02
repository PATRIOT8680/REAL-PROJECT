import {
  showInventory,
  hideInventory,
  moveItem,
  addItem,
  removeItem,
  updateItemQuantity,
  setDraggedItem,
  useItem,
  updateItemIsFast,
  setInventory,
  IHaveBag,
  IInventoryWeight,
  Item,
  typeSlots
} from "../../actions/menus/inventory.ts";

let storeInstance: any = null;

export const setStore = (store: any) => {
  storeInstance = store
}

export const inventoryStore = {
  showInventory: (haveDonatSlots: boolean, tradeOpen: boolean) => storeInstance.dispatch(showInventory(haveDonatSlots, tradeOpen)),
  hideInventory: () => storeInstance.dispatch(hideInventory()),

  moveItem: (sourceSection: typeSlots, sourceSlot: number, targetSection: typeSlots, targetSlot: number) =>
    storeInstance.dispatch(moveItem(sourceSection, sourceSlot, targetSection, targetSlot)),

  addItem: (item: Item, section: typeSlots, slot?: number) =>
    storeInstance.dispatch(addItem(item, section, slot)),

  removeItem: (section: typeSlots, slot: number) =>
    storeInstance.dispatch(removeItem(section, slot)),

  updateItemQuantity: (section: typeSlots, slot: number, quantity: number) =>
    storeInstance.dispatch(updateItemQuantity(section, slot, quantity)),

  setDraggedItem: (item: Item | null, source: string | null) =>
    storeInstance.dispatch(setDraggedItem(item, source)),

  useItem: (section: typeSlots, slot: number) =>
    storeInstance.dispatch(useItem(section, slot)),

  updateItemIsFast: (itemId: number, isFast: boolean) =>
    storeInstance.dispatch(updateItemIsFast(itemId, isFast)),

  setInventory: (
    mainSlots: (Item | null)[],
    bagSlots: (Item | null)[],
    donatSlots: (Item | null)[],
    tradeSlots: (Item | null)[],
    returnTradeSlots: (Item | null)[],
    clothesSlots: (Item | null)[],
    fastSlots: (Item | null)[],
    haveBag?: IHaveBag,
    weight?: IInventoryWeight,
  ) =>
    storeInstance.dispatch(setInventory(mainSlots, bagSlots, donatSlots, tradeSlots, returnTradeSlots, clothesSlots, fastSlots, haveBag, weight)),

  getInventoryState: () => {
    const state = storeInstance.getState()
    return state.inventoryReducer
  },

  findEmptySlot: (section: typeSlots): number => {
    const state = storeInstance.getState().inventoryReducer
    const slots = section === 'main' ? state.mainSlots : section === 'bag'
      ? state.bagSlots : section === 'donat'
        ? state.donatSlots : section === 'trade'
          ? state.tradeSlots : section === 'returnTrade'
            ? state.returnTradeSlots : state.fastSlots

    return slots.findIndex((slot: any) => slot === null)
  },

  hasItem: (itemId: number): boolean => {
    const state = storeInstance.getState().inventoryReducer
    const allSlots = [...state.mainSlots, ...state.bagSlots, ...state.donatSlots, ...state.tradeSlots]
    return allSlots.some(slot => slot?.id === itemId)
  },

  getItemQuantity: (itemId: number): number => {
    const state = storeInstance.getState().inventoryReducer
    const allSlots = [...state.mainSlots, ...state.bagSlots, ...state.donatSlots, ...state.tradeSlots]
    return allSlots
      .filter(slot => slot?.id === itemId)
      .reduce((total, slot) => total + (slot?.quantity || 0), 0)
  }
}