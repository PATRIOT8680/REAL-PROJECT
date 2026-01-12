import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Item, InventoryState } from "../../../actions/menus/inventory.ts";
import { RootState } from "../../../reducers/rootReducer.ts";

import InventorySlot from "./InventorySlot.tsx";

interface IMainSection {
  onItemDragStart: (item: Item, source: string) => void;
  onItemDrop: (targetSlot: number, sourceData: string) => void;
}

const MainSection = ({ onItemDragStart, onItemDrop }: IMainSection) => {
  const mainSlots = useSelector((state: RootState) => state.inventoryReducer.mainSlots)

  const handleDragStart = (item: Item, slotIndex: number) => {
    onItemDragStart(item, `main-${slotIndex}`)
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
      <span className="name-section">Ваш персонаж</span>
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {mainSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="main"
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            slotType={getSlotType(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default MainSection