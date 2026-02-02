import { useSelector } from "react-redux";
import { Item, InventoryState } from "../../../actions/menus/inventory.ts";
import { RootState } from "../../../reducers/rootReducer.ts";

import InventorySlot from "./InventorySlot.tsx";

interface IBagSection {
  onItemDragStart: (item: Item, source: string) => void;
  onItemDrop: (targetSlot: number, sourceData: string) => void;
}

const BagSection = ({ onItemDragStart, onItemDrop }: IBagSection) => {
  const bagSlots = useSelector((state: RootState) => state.inventoryReducer.bagSlots)
  const clothesSlots = useSelector((state: RootState) => state.inventoryReducer.clothesSlots)

  const bagSlotIndex = 10
  const hasBagEquipped = clothesSlots[bagSlotIndex] && clothesSlots[bagSlotIndex]!.imageId === 109

  if (!hasBagEquipped) return null

  const handleDragStart = (item: Item, slotIndex: number) => {
    onItemDragStart(item, `bag-${slotIndex}`)
  }

  const handleDrop = (slotIndex: number, sourceData: string) => {
    onItemDrop(slotIndex, sourceData)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getSlotType = (index: number): string => {
    const slotTypes = ['weapon', 'weapon', 'medical', 'clothing', 'clothing', 'misc']
    return slotTypes[index] || 'misc'
  }

  return (
    <section className="section-slots">
      <span className="name-section">Сумка</span>
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {bagSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="bag"
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            slotType={getSlotType(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default BagSection