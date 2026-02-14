import {
  InventoryState,
  InventoryAction,
  Item,
  getClothesSlotType,
  CLOTHES_SLOT_TYPES
} from "../../actions/menus/inventory.ts";
import { rce } from "../../modules/rce.ts";

const testItems: Item[] = [
  {
    id: 1,
    name: "Пистолет Ghingal Knigs",
    imageId: 1,
    quantity: 1,
    maxStack: 1,
    type: "food",
    weight: 1.5,
    description: "Обычный пистолет 9mm",
    stackable: false
  },
  {
    id: 2,
    name: "Бургер",
    imageId: 2,
    quantity: 3,
    maxStack: 5,
    type: "food",
    weight: 0.5,
    description: "Восстанавливает здоровье",
    stackable: true
  },
  {
    id: 3,
    name: "Бейсболка",
    imageId: 111, // Для одежды imageId должен соответствовать типу
    quantity: 1,
    maxStack: 1,
    type: "clothes",
    weight: 0.2,
    description: "Стильная бейсболка",
    stackable: false
  },
]

const initialMainSlots = Array(20).fill(null)
const initialBagSlots = Array(20).fill(null)
const initialDonatSlots = Array(15).fill(null)
const initialTradeSlots = Array(5).fill(null)
const initialReturnTradeSlots = Array(5).fill(null)
const initialClothesSlots = Array(13).fill(null)
const initialFastSlots = Array(4).fill(null)

initialMainSlots[0] = testItems[0]
initialMainSlots[1] = testItems[1]
initialMainSlots[2] = testItems[2]

const initialState: InventoryState = {
  isVisible: true,
  mainSlots: initialMainSlots,
  bagSlots: initialBagSlots,
  donatSlots: initialDonatSlots,
  tradeSlots: initialTradeSlots,
  returnTradeSlots: initialReturnTradeSlots,
  clothesSlots: initialClothesSlots,
  fastSlots: initialFastSlots,
  draggedItem: null,
  haveDonatSlots: false,
  tradeOpen: true,
  weight: {
    current: 29,
    max: 50
  },
  tradeStatus: 'other-ready'
}

const findEmptySlot = (slots: (Item | null)[]): number => {
  return slots.findIndex(slot => slot === null)
}

const canStack = (item1: Item, item2: Item): boolean | undefined => {
  return item1.id === item2.id && item1.stackable && item2.stackable
}

const findAndUpdateIsFast = (state: InventoryState, itemId: number, isFast: boolean): InventoryState => {
  const updateSlots = (slots: (Item | null)[]) => {
    return slots.map(item => item && item.id === itemId ? { ...item, isFast } : item)
  }

  return {
    ...state,
    mainSlots: updateSlots(state.mainSlots),
    donatSlots: updateSlots(state.donatSlots),
    bagSlots: updateSlots(state.bagSlots),
    tradeSlots: updateSlots(state.tradeSlots),
    returnTradeSlots: updateSlots(state.returnTradeSlots),
    clothesSlots: updateSlots(state.clothesSlots),
    fastSlots: updateSlots(state.fastSlots),
  }
}

const swapItems = (
  sourceSlots: (Item | null)[],
  sourceIndex: number,
  targetSlots: (Item | null)[],
  targetIndex: number
): { newSourceSlots: (Item | null)[], newTargetSlots: (Item | null)[] } => {
  const newSourceSlots = [...sourceSlots]
  const newTargetSlots = [...targetSlots]

  const temp = newSourceSlots[sourceIndex]
  newSourceSlots[sourceIndex] = newTargetSlots[targetIndex]
  newTargetSlots[targetIndex] = temp

  return { newSourceSlots, newTargetSlots }
}

export const inventoryReducer = (state: InventoryState = initialState, action: InventoryAction): InventoryState => {
    switch (action.type) {
      case 'SHOW_INVENTORY':
        return {
          ...state,
          isVisible: true,
          haveDonatSlots: action.payload.haveDonatSlots,
          tradeOpen: action.payload.tradeOpen
        }

      case 'HIDE_INVENTORY':
        return {
          ...state,
          isVisible: false
        };
      case 'MOVE_ITEM': {
        const { sourceSection, sourceSlot, targetSection, targetSlot } = action.payload;

        if (sourceSection === targetSection && sourceSlot === targetSlot) {
          console.log('Перемещение в тот же слот - игнорируем')
          return state;
        }

        const getSlots = (section: string) => {
          switch(section) {
            case 'main': return state.mainSlots
            case 'bag': return state.bagSlots
            case 'donat': return state.donatSlots
            case 'trade': return state.tradeSlots
            case 'returnTrade': return state.returnTradeSlots
            case 'clothes': return state.clothesSlots
            case 'fast': return state.fastSlots
            default: return state.mainSlots
          }
        }

        const sourceSlots = getSlots(sourceSection)
        const targetSlots = getSlots(targetSection)

        const sourceItem = sourceSlots[sourceSlot]
        const targetItem = targetSlots[targetSlot]

        if (!sourceItem) return state

        console.log('Moving item:', {
          from: `${sourceSection}-${sourceSlot}`,
          to: `${targetSection}-${targetSlot}`,
          item: sourceItem.name
        });


        if (sourceSection === 'fast') {
          const newFastSlots = [...state.fastSlots]
          const sourceItem = newFastSlots[sourceSlot]

          if (!sourceItem) return state

          // Если перемещаем между фаст-слотами - меняем местами
          if (targetSection === 'fast') {
            const temp = newFastSlots[sourceSlot]
            newFastSlots[sourceSlot] = newFastSlots[targetSlot]
            newFastSlots[targetSlot] = temp
            rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, targetSection, targetSlot)
            return { ...state, fastSlots: newFastSlots }
          }

          // Если перемещаем из фаст-слота в другую секцию
          // Удаляем предмет из фаст-слота
          newFastSlots[sourceSlot] = null

          // Сбрасываем флаг isFast у оригинала
          state = findAndUpdateIsFast(state, sourceItem.id, false)

          rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, targetSection, targetSlot)
          return { ...state, fastSlots: newFastSlots }
        }

        if (targetSection === 'fast') {
          if (sourceItem.type === 'clothes') {
            console.log('Одежду нельзя добавлять в быстрые слоты');
            return state;
          }

          let newState = { ...state };
          const newFastSlots = [...state.fastSlots];

          // 1. Если в целевом слоте уже есть предмет — **полностью** сбрасываем его isFast
          if (newFastSlots[targetSlot]) {
            const oldItem = newFastSlots[targetSlot]!;
            newState = findAndUpdateIsFast(newState, oldItem.id, false);
            // Можно даже очистить слот заранее
            newFastSlots[targetSlot] = null;
          }

          // 2. Если этот предмет уже где-то в другом fast-слоте — удаляем дубликат
          const itemId = sourceItem.id;
          for (let i = 0; i < newFastSlots.length; i++) {
            if (i !== targetSlot && newFastSlots[i] && newFastSlots[i]!.id === itemId) {
              newFastSlots[i] = null;
              newState = findAndUpdateIsFast(newState, itemId, false);
            }
          }

          // 3. Ставим новый предмет
          newFastSlots[targetSlot] = { ...sourceItem, isFast: true };

          // 4. Помечаем оригинал (в main/bag/etc.)
          const newSourceSlots = [...sourceSlots];
          newSourceSlots[sourceSlot] = { ...sourceItem, isFast: true };

          rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, targetSection, targetSlot);

          newState.fastSlots = newFastSlots;

          // Обновляем source-секцию
          if (sourceSection === 'main') newState.mainSlots = newSourceSlots;
          else if (sourceSection === 'bag') newState.bagSlots = newSourceSlots;
          else if (sourceSection === 'donat') newState.donatSlots = newSourceSlots;
          else if (sourceSection === 'trade') newState.tradeSlots = newSourceSlots;
          else if (sourceSection === 'returnTrade') newState.returnTradeSlots = newSourceSlots;
          else if (sourceSection === 'clothes') newState.clothesSlots = newSourceSlots;

          return newState;
        }


        if (targetSection === 'bag' && sourceItem.imageId === 109) return state

        if (targetSection === 'clothes') {
          if (sourceItem.type !== 'clothes') return state

          const clothesSlotType = getClothesSlotType(sourceItem.imageId)
          const targetSlotIndex = CLOTHES_SLOT_TYPES.indexOf(clothesSlotType)

          if (targetSlotIndex === -1) return state
          if (targetSlot !== targetSlotIndex) return state

          const newSourceSlots = [...sourceSlots]
          const newClothesSlots = [...state.clothesSlots]

          const existingItem = newClothesSlots[targetSlotIndex]

          if (existingItem) {
            newClothesSlots[targetSlotIndex] = sourceItem
            newSourceSlots[sourceSlot] = existingItem

            if (targetSlotIndex === 10 && existingItem.imageId === 109) {
              rce.triggerServer('bagOperation', 'unequip', existingItem.id)
            }
          } else {
            newClothesSlots[targetSlotIndex] = sourceItem
            newSourceSlots[sourceSlot] = null
          }

          if (targetSlotIndex === 10 && sourceItem.imageId === 109) {
            rce.triggerServer('bagOperation', 'equip', sourceItem.id)
          }

          const newState = { ...state }

          if (sourceSection === 'main') newState.mainSlots = newSourceSlots
          else if (sourceSection === 'bag') newState.bagSlots = newSourceSlots
          else if (sourceSection === 'donat') newState.donatSlots = newSourceSlots
          else if (sourceSection === 'trade') newState.tradeSlots = newSourceSlots
          else if (sourceSection === 'returnTrade') newState.returnTradeSlots = newSourceSlots
          else if (sourceSection === 'clothes') newState.clothesSlots = newSourceSlots

          newState.clothesSlots = newClothesSlots

          rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, 'clothes', targetSlotIndex)

          return newState
        }

        if (sourceSection === 'clothes') {
          const newClothesSlots = [...sourceSlots]
          const newTargetSlots = [...targetSlots]

          // Мы снимаем одежду (source = clothes)
          // Цель — main / bag / donate — просто снимаем предмет
          // Обмен возможен ТОЛЬКО если targetSection === 'clothes' — но это уже обработано выше!
          // Значит здесь targetSection !== 'clothes' → просто снимаем

          // Если снимаем сумку — уведомляем сервер
          if (sourceSlot === 10 && sourceItem.imageId === 109) {
            rce.triggerServer('bagOperation', 'unequip', sourceItem.id)
          }

          // Проверяем, можно ли положить этот предмет в целевую секцию
          // Одежду можно класть в main/bag/donate — всегда разрешено
          // Но если в целевом слоте уже что-то есть и это НЕ одежда одного типа — НЕ МЕНЯЕМ МЕСТАМИ
          if (targetItem) {
            // Если в main/bag/donate лежит НЕ одежда того же типа — запрещаем обмен
            // Но на практике одежда не стакается, так что просто запретим обмен вообще при снятии
            // Лучше: просто кладём в пустой слот или стакаем, если можно, но НЕ меняем местами с другим предметом
            return state // ← ЗАПРЕЩАЕМ ОБМЕН ПРИ СНЯТИИ ОДЕЖДЫ
          }

          // Если целевой слот пустой — просто снимаем
          newClothesSlots[sourceSlot] = null
          newTargetSlots[targetSlot] = sourceItem

          const newState = { ...state }
          newState.clothesSlots = newClothesSlots

          // Обновляем целевую секцию
          if (targetSection === 'main') newState.mainSlots = newTargetSlots
          else if (targetSection === 'bag') newState.bagSlots = newTargetSlots
          else if (targetSection === 'donat') newState.donatSlots = newTargetSlots

          rce.triggerServer('moveItemInInventory', 'clothes', sourceSlot, targetSection, targetSlot)

          return newState
        }

        if (sourceSection === targetSection) {
          const newSlots = [...sourceSlots];

          // Если целевой слот пустой
          if (!targetItem) {
            newSlots[sourceSlot] = null;
            newSlots[targetSlot] = sourceItem;
          }
          // Если можно стакать
          else if (canStack(sourceItem, targetItem)) {
            const totalQuantity = sourceItem.quantity + targetItem.quantity;
            const maxStack = sourceItem.maxStack;

            if (totalQuantity <= maxStack) {
              newSlots[sourceSlot] = null;
              newSlots[targetSlot] = { ...targetItem, quantity: totalQuantity };
            } else {
              const remainingQuantity = totalQuantity - maxStack;
              newSlots[sourceSlot] = { ...sourceItem, quantity: remainingQuantity };
              newSlots[targetSlot] = { ...targetItem, quantity: maxStack };
            }
          }
          // Если нельзя стакать - меняем местами
          else {
            newSlots[sourceSlot] = targetItem;
            newSlots[targetSlot] = sourceItem;
          }

          // ИСПРАВЛЕННЫЙ stateKey — ДОБАВЬ 'fast'!
          const stateKey =
            sourceSection === 'main' ? 'mainSlots' :
              sourceSection === 'bag' ? 'bagSlots' :
                sourceSection === 'donat' ? 'donatSlots' :
                  sourceSection === 'trade' ? 'tradeSlots' :
                    sourceSection === 'returnTrade' ? 'returnTradeSlots' :
                      sourceSection === 'fast' ? 'fastSlots' :  // ← Вот это и не хватало!
                        'mainSlots';  // fallback

          // Всегда отправляем на сервер (теперь и для fast будет работать)
          rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, targetSection, targetSlot)

          return {
            ...state,
            [stateKey]: newSlots
          };
        }
        // Если это перемещение между разными секциями
        else {
          const newSourceSlots = [...sourceSlots];
          const newTargetSlots = [...targetSlots];

          // Если целевой слот пустой
          if (!targetItem) {
            newSourceSlots[sourceSlot] = null;
            newTargetSlots[targetSlot] = sourceItem;
          }
          // Если можно стакать
          else if (canStack(sourceItem, targetItem)) {
            const totalQuantity = sourceItem.quantity + targetItem.quantity;
            const maxStack = sourceItem.maxStack;

            if (totalQuantity <= maxStack) {
              newSourceSlots[sourceSlot] = null;
              newTargetSlots[targetSlot] = { ...targetItem, quantity: totalQuantity };
            } else {
              const remainingQuantity = totalQuantity - maxStack;
              newSourceSlots[sourceSlot] = { ...sourceItem, quantity: remainingQuantity };
              newTargetSlots[targetSlot] = { ...targetItem, quantity: maxStack };
            }
          } else {
            newSourceSlots[sourceSlot] = targetItem;
            newTargetSlots[targetSlot] = sourceItem;
          }

          const newState = { ...state }

          rce.triggerServer('moveItemInInventory', sourceSection, sourceSlot, targetSection, targetSlot)


          if (sourceSection === 'main') {
            newState.mainSlots = newSourceSlots
          } else if (sourceSection === 'bag') {
            newState.bagSlots = newSourceSlots
          } else if (sourceSection === 'donat') {
            newState.donatSlots = newSourceSlots
          } else if (sourceSection === 'trade') {
            newState.tradeSlots = newSourceSlots
          } else if (sourceSection === 'returnTrade') {
            newState.returnTradeSlots = newSourceSlots
          } else if (sourceSection === 'clothes') {
            newState.clothesSlots = newSourceSlots
          }

          if (targetSection === 'main') {
            newState.mainSlots = newTargetSlots
          } else if (targetSection === 'bag') {
            newState.bagSlots = newTargetSlots
          } else if (targetSection === 'donat') {
            newState.donatSlots = newTargetSlots
          } else if (targetSection === 'trade') {
            newState.tradeSlots = newTargetSlots
          } else if (targetSection === 'returnTrade') {
            newState.returnTradeSlots = newTargetSlots
          } else if (targetSection === 'clothes') {
            newState.clothesSlots = newTargetSlots
          }

          return newState
        }
      }
      case 'ADD_ITEM': {
        const { item, section, slot } = action.payload

        let slots: (Item | null)[]
        let stateKey: string

        switch(section) {
          case 'main':
            slots = state.mainSlots
            stateKey = 'mainSlots'
            break
          case 'bag':
            slots = state.bagSlots
            stateKey = 'bagSlots'
            break
          case 'donat':
            slots = state.donatSlots
            stateKey = 'donatSlots'
            break
          case 'trade':
            slots = state.tradeSlots
            stateKey = 'tradeSlots'
            break
          case 'returnTrade':
            slots = state.returnTradeSlots
            stateKey = 'returnTradeSlots'
            break
          case 'clothes':
            slots = state.clothesSlots
            stateKey = 'clothesSlots'
            break
          case 'fast':
            slots = state.fastSlots
            stateKey = 'fastSlots'
            break
          default:
            slots = state.mainSlots
            stateKey = 'mainSlots'
        }

        let targetSlot: number

        if (section === 'clothes' && item.type === 'clothes') {
          const clothesSlotType = getClothesSlotType(item.imageId)
          targetSlot = CLOTHES_SLOT_TYPES.indexOf(clothesSlotType)
          if (targetSlot === -1) return state
        } else {
          targetSlot = slot !== undefined ? slot : findEmptySlot(slots)
        }

        if (targetSlot === -1) return state

        const newSlots = [...slots]
        const existingItem = newSlots[targetSlot]

        if (section === 'clothes') {
          newSlots[targetSlot] = item
        } else if (existingItem && canStack(existingItem, item)) {
          const totalQuantity = existingItem.quantity + item.quantity
          const maxStack = existingItem.maxStack

          if (totalQuantity <= maxStack) {
            newSlots[targetSlot] = { ...existingItem, quantity: totalQuantity }
          } else {
            newSlots[targetSlot] = { ...existingItem, quantity: maxStack }
          }
        } else {
          newSlots[targetSlot] = item
        }

        return {
          ...state,
          [stateKey]: newSlots
        }
      }

      case 'REMOVE_ITEM': {
        const { section, slot } = action.payload

        let slots: (Item | null)[]
        let stateKey: string

        switch(section) {
          case 'main':
            slots = state.mainSlots
            stateKey = 'mainSlots'
            break
          case 'bag':
            slots = state.bagSlots
            stateKey = 'bagSlots'
            break
          case 'donat':
            slots = state.donatSlots
            stateKey = 'donatSlots'
            break
          case 'trade':
            slots = state.tradeSlots
            stateKey = 'tradeSlots'
            break
          case 'returnTrade':
            slots = state.returnTradeSlots
            stateKey = 'returnTradeSlots'
            break
          case 'clothes':
            slots = state.clothesSlots
            stateKey = 'clothesSlots'
            break
          case 'fast':
            slots = state.fastSlots
            stateKey = 'fastSlots'
            break
          default:
            slots = state.mainSlots
            stateKey = 'mainSlots'
        }

        const newSlots = [...slots]
        newSlots[slot] = null

        return {
          ...state,
          [stateKey]: newSlots
        }
      }

      case 'UPDATE_ITEM_QUANTITY': {
        const { section, slot, quantity } = action.payload

        let slots: (Item | null)[]
        let stateKey: string

        switch(section) {
          case 'main':
            slots = state.mainSlots
            stateKey = 'mainSlots'
            break
          case 'bag':
            slots = state.bagSlots
            stateKey = 'bagSlots'
            break
          case 'donat':
            slots = state.donatSlots
            stateKey = 'donatSlots'
            break
          case 'trade':
            slots = state.tradeSlots
            stateKey = 'tradeSlots'
            break
          case 'returnTrade':
            slots = state.returnTradeSlots
            stateKey = 'returnTradeSlots'
            break
          case 'clothes':
            slots = state.clothesSlots
            stateKey = 'clothesSlots'
            break
          case 'fast':
            slots = state.fastSlots
            stateKey = 'fastSlots'
            break
          default:
            slots = state.mainSlots
            stateKey = 'mainSlots'
        }

        if (!slots[slot]) return state

        const newSlots = [...slots]

        if (quantity <= 0) {
          newSlots[slot] = null
        } else {
          newSlots[slot] = { ...newSlots[slot]!, quantity }
        }

        return {
          ...state,
          [stateKey]: newSlots
        }
      }

      case 'SET_DRAGGED_ITEM':
        return {
          ...state,
          draggedItem: action.payload
        }

      case 'USE_ITEM': {
        const { section, slot } = action.payload

        let slots: (Item | null)[]
        let stateKey: string

        switch(section) {
          case 'main':
            slots = state.mainSlots
            stateKey = 'mainSlots'
            break
          case 'bag':
            slots = state.bagSlots
            stateKey = 'bagSlots'
            break
          case 'donat':
            slots = state.donatSlots
            stateKey = 'donatSlots'
            break
          case 'trade':
            slots = state.tradeSlots
            stateKey = 'tradeSlots'
            break
          case 'returnTrade':
            slots = state.returnTradeSlots
            stateKey = 'returnTradeSlots'
            break
          case 'clothes':
            slots = state.clothesSlots
            stateKey = 'clothesSlots'
            break
          default:
            slots = state.mainSlots
            stateKey = 'mainSlots'
        }

        const item = slots[slot]

        if (!item) return state

        const newSlots = [...slots]

        if (item.quantity > 1) {
          newSlots[slot] = { ...item, quantity: item.quantity }
        } else {
          newSlots[slot] = null
        }

        console.log(`Использован предмет: ${item.name}`)

        return {
          ...state,
          [stateKey]: newSlots
        }
      }

      case 'UPDATE_ITEM_ISFAST': {
        const { itemId, isFast } = action.payload

        const updateSlots = (slots: (Item | null)[]) =>
          slots.map(item => item && item.id === itemId ? { ...item, isFast } : item)

        return {
          ...state,
          mainSlots: updateSlots(state.mainSlots),
          bagSlots: updateSlots(state.bagSlots),
          donatSlots: updateSlots(state.donatSlots),
          tradeSlots: updateSlots(state.tradeSlots),
          returnTradeSlots: updateSlots(state.returnTradeSlots),
          clothesSlots: updateSlots(state.clothesSlots),
        }
      }

      case 'SET_TRADE_STATUS':
        return {
          ...state,
          tradeStatus: action.payload
        }

      case 'SET_INVENTORY': {
        const { mainSlots, bagSlots, donatSlots, tradeSlots, returnTradeSlots, clothesSlots, fastSlots, haveBag, weight } = action.payload
        return {
          ...state,
          mainSlots,
          bagSlots,
          donatSlots,
          tradeSlots,
          returnTradeSlots,
          clothesSlots: clothesSlots || initialClothesSlots,
          fastSlots: fastSlots || initialFastSlots,
          weight: weight || state.weight
        }
      }

      default:
        return state
    }
}