import './assets/styles/compiled-css/Index.css'
import {useEffect, useState} from "react"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { Item, InventoryState, moveItem, setDraggedItem, IHaveBag, typeSlots } from "../../actions/menus/inventory.ts";
import { rce } from "../../modules/rce.ts";
import { inventoryStore } from "../../store/menus/inventory.ts";

import Header from "./components/Header.tsx";
import MainSection from "./components/MainSection.tsx";
import DonateSection from "./components/DonateSection.tsx";
import BagSection from "./components/BagSection.tsx";
import BuyDonatSlots from "./components/BuyDonatSlots.tsx";
import TradeSection from "./components/TradeSection.tsx";
import ClothesSection from "./components/ClothesSection.tsx";
import FastSection from "./components/FastSection.tsx";
import AbsenseBag from "./components/AbsenseBag.tsx";

interface IInventory {
  haveDonateSlots: boolean,
  haveBagSlots?: IHaveBag,
}

const Inventory = ({ haveDonateSlots, haveBagSlots }: IInventory) => {
  const dispatch = useDispatch()
  const [hidedInventory, setHidedInventory] = useState<boolean>(false)
  const draggedItem = useSelector((state: RootState) => state.inventoryReducer?.draggedItem || null);
  const inventoryState = useSelector((state: RootState) => state.inventoryReducer)
  const clSlots = useSelector((state: RootState) => state.inventoryReducer.clothesSlots)
  const isBagEquipped = !!clSlots?.[10]

  rce.register('fadeCloseInventory', () => {
    setHidedInventory(true)
  })

  const resetAllDragStates = () => {
    const allSlots = document.querySelectorAll('.inventory-slot')
    allSlots.forEach(slot => {
      slot.classList.remove('drag-source', 'drag-over')
    })
  }

  const closeInventory = () => {
    rce.triggerClient('hideInventory')
  }

  const handleItemDragStart = (item: Item, source: string) => {
    dispatch(setDraggedItem(item, source))
  }

  const handleItemDrop = (targetSlot: number, sourceData: string, targetSection: string) => {
    const [sourceSection, sourceSlotStr] = sourceData.split('-')
    const sourceSlot = parseInt(sourceSlotStr)

    if (!draggedItem) return

    console.log(`Перемещение: из ${sourceSection}-${sourceSlot} в ${targetSection}-${targetSlot}`)
    console.log('Предмет перемещен:', draggedItem.item.name)

    dispatch(moveItem(
      sourceSection as typeSlots,
      sourceSlot,
      targetSection as typeSlots,
      targetSlot
    ))

    dispatch(setDraggedItem(null, null))
    setTimeout(resetAllDragStates, 50)
  }

  return (
      <div className={`inventory-menu ${hidedInventory ? 'hided' : ''}`}>
        <svg className='shadow-bg' width="1115" height="273" viewBox="0 0 1115 273" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="557.104" cy="136.354" rx="557.104" ry="136.354" fill="#B89D62" fill-opacity="0.4"/>
        </svg>
        <Header closeInventory={closeInventory} />
        <div className="inventory-content">
          <div className="left-section">
            <MainSection
              onItemDragStart={handleItemDragStart}
              onItemDrop={(slot, source) => handleItemDrop(slot, source, 'main')}
            />
            { inventoryState.haveDonatSlots ? (
              <DonateSection
                onItemDragStart={handleItemDragStart}
                onItemDrop={(slot, source) => handleItemDrop(slot, source, 'donat')}
              />
            ) : (
              <BuyDonatSlots />
            ) }

          </div>
          <div className="center-section">
            <ClothesSection
              onItemDragStart={handleItemDragStart}
              onItemDrop={(slot, source) => handleItemDrop(slot, source, 'clothes')}
            />
            <FastSection
              onItemDragStart={handleItemDragStart}
              onItemDrop={(slot, source) => handleItemDrop(slot, source, 'fast')}
            />
          </div>
          <div className="right-section">
            { isBagEquipped ? (
              <BagSection
                onItemDragStart={handleItemDragStart}
                onItemDrop={(slot, source) => handleItemDrop(slot, source, 'bag')}
              />
            ) : (
              <AbsenseBag />
            ) }
            { inventoryState.tradeOpen && (
              <TradeSection
                onItemDragStart={handleItemDragStart}
                onItemDrop={handleItemDrop}
              />
            ) }
          </div>
        </div>
      </div>
  )
}

export default Inventory