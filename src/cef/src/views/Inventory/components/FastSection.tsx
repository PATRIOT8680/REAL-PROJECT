import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { Item } from "../../../actions/menus/inventory.ts";
import InventorySlot from "./InventorySlot.tsx";

interface IFastSection {
  onItemDragStart: (item: Item, source: string) => void;
  onItemDrop: (targetSlot: number, sourceData: string) => void;
}

const FastSection = ({ onItemDragStart, onItemDrop }: IFastSection) => {
  const fastSlots = useSelector((state: RootState) => state.inventoryReducer.fastSlots)

  const handleDragStart = (item: Item, slotIndex: number) => {
    onItemDragStart(item, `fast-${slotIndex}`)
  }

  const handleDrop = (slotIndex: number, sourceData: string) => {
    onItemDrop(slotIndex, sourceData)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <section className="section-slots">
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {fastSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="fast"
            slotType="fast"
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </section>
  )
}

export default FastSection