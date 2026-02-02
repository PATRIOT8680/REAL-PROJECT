import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Item, InventoryState } from "../../../actions/menus/inventory.ts";
import { RootState } from "../../../reducers/rootReducer.ts";

import InventorySlot from "./InventorySlot.tsx";

interface IDonateSection {
  onItemDragStart: (item: Item, source: string) => void;
  onItemDrop: (targetSlot: number, sourceData: string) => void;
}

const DonateSection = ({ onItemDragStart, onItemDrop }: IDonateSection) => {
  const donatSlots = useSelector((state: RootState) => state.inventoryReducer.donatSlots)

  const handleDragStart = (item: Item, slotIndex: number) => {
    onItemDragStart(item, `donat-${slotIndex}`)
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
      <span className="name-section">Донат - слоты</span>
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {donatSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="donat"
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            slotType={getSlotType(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default DonateSection