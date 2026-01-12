import './assets/styles/compiled-css/ClothesSection.css'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { CLOTHES_SLOT_TYPES, getClothesIconId, Item } from "../../../actions/menus/inventory.ts";

import InventorySlot from "./InventorySlot.tsx";

interface IClothesSection {
  onItemDragStart: (item: Item, source: string) => void
  onItemDrop: (targetSlot: number, sourceData: string) => void
}

const ClothesSection = ({ onItemDragStart, onItemDrop }: IClothesSection) => {
  const clothesSlots = useSelector((state: RootState) => state.inventoryReducer.clothesSlots)
  const nickname = useSelector((state: RootState) => state.playerInfoReducer.nickname)

  const rowConfig = [
    { slots: [0], justify: 'center' },
    { slots: [1, 2, 3], justify: 'space-between' },
    { slots: [4, 5, 6], justify: 'space-between' },
    { slots: [7, 8, 9], justify: 'space-between' },
    { slots: [10], justify: 'center' },
    { slots: [11], justify: 'center' },
  ]

  const slotNames = [
    'Голова',
    'Украшения',
    'Маска',
    'Очки',
    'Браслет',
    'Футболка',
    'Перчатки',
    'Бронежилет',
    'Верх',
    'Рюкзак',
    'Штаны',
    'Обувь'
  ]

  const handleDragStart = (item: Item, slotIndex: number) => {
    onItemDragStart(item, `clothes-${slotIndex}`)
  }

  const handleDrop = (slotIndex: number, sourceData: string) => {
    onItemDrop(slotIndex, sourceData)
  }

  const getSlotBgIcon = (slotIdx: number): string => {
    const slotType = CLOTHES_SLOT_TYPES[slotIdx]
    const iconId = getClothesIconId(slotType)
    return `./assets/img/inventory/iconsClothes/${iconId}.svg`
  }

  return (
    <div className="clothes-section">
      <span className="nickname-char">{nickname}</span>
      <div className="clothes-grid">
        {rowConfig.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="clothes-row"
            style={{ justifyContent: row.justify }}
          >
            {row.slots.map(slotIndex => {
              const item = clothesSlots[slotIndex]

              return (
                <div key={slotIndex} className="clothes-slot-wrapper">
                  <InventorySlot
                    slotId={slotIndex}
                    item={item}
                    section="clothes"
                    slotType="clothes"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    additionalData={{
                      backgroundIcon: getSlotBgIcon(slotIndex),
                      slotTypeLabel: slotNames[slotIndex]
                    }}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClothesSection