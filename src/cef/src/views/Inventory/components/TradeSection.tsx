import './assets/styles/compiled-css/TradeSection.css'
import { useState, useEffect, useRef, DragEvent } from "react";
import { useSelector } from "react-redux";
import { Item, InventoryState } from "../../../actions/menus/inventory.ts";
import { RootState } from "../../../reducers/rootReducer.ts";
import { getDateTime } from "../../../modules/dateTime.ts";
import { rce } from "../../../modules/rce.ts";

import InventorySlot from "./InventorySlot.tsx";

interface ITradeSection {
  onItemDragStart: (item: Item, source: string) => void;
  onItemDrop: (targetSlot: number, sourceData: string, targetSection: string) => void
}

const TradeSection = ({ onItemDragStart, onItemDrop }: ITradeSection) => {
  const tradeSlots = useSelector((state: RootState) => state.inventoryReducer.tradeSlots)
  const returnTradeSlots = useSelector((state: RootState) => state.inventoryReducer.returnTradeSlots)
  const statusTrade = useSelector((state: RootState) => state.inventoryReducer.tradeStatus)

  const prevTradeSlotsRef = useRef(tradeSlots)
  const isFirstRender = useRef(true)

  const isSlotsDisabled = statusTrade === 'my-ready' || statusTrade === 'both-ready'

  const handleReadyTrade = () => {
    rce.triggerServer('tradeSetReady', true)
  }

  const handleCancelTrade = () => {
    if (statusTrade === 'no-ready') {
      rce.triggerServer('tradeCancel')
    } else {
      rce.triggerServer('tradeSetReady', false)
    }
  }

  const handleDragStartTrade = (item: Item, slotIndex: number) => {
    if (isSlotsDisabled) return
    onItemDragStart(item, `trade-${slotIndex}`)
  }

  const handleDrop = (slotIndex: number, sourceData: string, targetSection: string) => {
    if (isSlotsDisabled) return
    onItemDrop(slotIndex, sourceData, targetSection)
  }

  const handleDragOver = (e: DragEvent) => {
    if (isSlotsDisabled) return
    e.preventDefault()
  }

  const handleDropTrade = (slotIndex: number, sourceData: string) => {
    handleDrop(slotIndex, sourceData, 'trade')
  }

  const getSlotType = (index: number): string => {
    const slotTypes = ['weapon', 'weapon', 'medical', 'clothing', 'clothing', 'misc']
    return slotTypes[index] || 'misc'
  }

  const getStatusText = () => {
    switch (statusTrade) {
      case 'no-ready':
        return 'Обменяться'
      case 'my-ready':
        return 'Ожидайте игрока'
      case 'other-ready':
        return 'Подтвердить'
      case 'both-ready':
        return 'Обмениваемся...'
      default:
        return ''
    }
  }

  return (
    <section className="section-slots">
      <span className="name-section">Вы отдаете</span>
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {tradeSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="trade"
            onDragStart={handleDragStartTrade}
            onDrop={handleDropTrade}
            slotType={getSlotType(index)}
            isSlotsDisabled={isSlotsDisabled}
          />
        ))}
      </div>
      <span className="name-section">Получаете от игрока</span>
      <div
        className="section-slots-grid"
        onDragOver={handleDragOver}
      >
        {returnTradeSlots.map((item, index) => (
          <InventorySlot
            key={index}
            slotId={index}
            item={item}
            section="returnTrade"
            slotType={getSlotType(index)}
            isSlotsDisabled={true}
          />
        ))}
      </div>
      <div className="btns-action">
        { tradeSlots.some(slot => slot !== null) && (
          <button
            className={`action ${statusTrade}`}
            onClick={(statusTrade === 'no-ready' || statusTrade === 'other-ready') ? handleReadyTrade : undefined}
            disabled={statusTrade === 'my-ready' || statusTrade === 'both-ready'}
          >
            { getStatusText() }
            { statusTrade === 'both-ready' && (
              <svg className='loader-svg' viewBox="0 0 57 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M46.1777 3.50014C49.674 6.99646 52.055 11.451 53.0196 16.3006C53.9843 21.1501 53.4892 26.1768 51.597 30.7449C49.7048 35.3131 46.5005 39.2176 42.3892 41.9646C38.278 44.7116 33.4445 46.1778 28.4999 46.1778C23.5554 46.1778 18.7219 44.7115 14.6107 41.9645C10.4994 39.2174 7.29513 35.3129 5.40297 30.7448C3.5108 26.1766 3.01575 21.1499 3.98041 16.3004C4.94508 11.4509 7.32614 6.99629 10.8225 3.5" stroke="#FFCA58" stroke-width="7" stroke-linecap="round"/>
              </svg>
            ) }
          </button>
        ) }
        <button className={`action ${ statusTrade === 'no-ready' ? 'cancel' : 'stoped' }`} onClick={handleCancelTrade}>
          { statusTrade === 'no-ready' ? 'Отменить' : 'Приостановить' }
        </button>
      </div>
    </section>
  )
}

export default TradeSection