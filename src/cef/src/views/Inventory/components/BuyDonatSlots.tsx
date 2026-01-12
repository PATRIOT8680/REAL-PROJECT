import './assets/styles/compiled-css/BuyDonatSlots.css'
import { useState } from 'react'
import { rce } from "../../../modules/rce.ts";

import AcceptMenu from "../../../components/AcceptMenu/AcceptMenu.tsx";
import InventorySlot from "./InventorySlot.tsx";

const BuyDonatSlots = () => {
  const [showAcceptMenu, setShowAcceptMenu] = useState<boolean>(false)

  const handleAccept = () => {
    rce.triggerServer('cef:buy-donat-slots')
  }

  const handleClose = () => {
    setShowAcceptMenu(false)
  }

  return (
    <>
      <div className="buy-donatslots">
        <ul className="bottom-content">
          {Array.from({ length: 15 }).map((_, index) => (
            <li key={index}>
              <InventorySlot
                slotId={index}
                item={null}
                section="donate"
                slotType="locked"
                onDragStart={() => {}}
                onDrop={() => {}}
                isSlotsDisabled={true}
              />
            </li>
          ))}
        </ul>
        <div className="top-content">
          <svg className="shadow-bg-inv" width="509" height="124" viewBox="0 0 509 124" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="254.5" cy="62" rx="254.5" ry="62" fill="#B89D62" fill-opacity="0.38"/>
          </svg>
          <div className="icon-lock" onClick={() => setShowAcceptMenu(true)}>
            <svg width="34" height="37" viewBox="0 0 34 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.41667 16.75V10.0833C8.41667 7.8732 9.29464 5.75358 10.8574 4.19078C12.4202 2.62797 14.5399 1.75 16.75 1.75C18.9601 1.75 21.0798 2.62797 22.6426 4.19078C24.2054 5.75358 25.0833 7.8732 25.0833 10.0833V16.75M5.08333 16.75H28.4167C30.2576 16.75 31.75 18.2424 31.75 20.0833V31.75C31.75 33.5909 30.2576 35.0833 28.4167 35.0833H5.08333C3.24238 35.0833 1.75 33.5909 1.75 31.75V20.0833C1.75 18.2424 3.24238 16.75 5.08333 16.75Z" stroke="#676565" stroke-opacity="0.8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div className="description">
            <span className="title">Больше места, больше возможностей!</span>
            <span className="subtitle">Купите дополнительные слоты, в которые вы сможете складывать больше вещей!</span>
          </div>
          <div className="details">
            <div className="detail">
              <span className="big-text">+15</span>
              <span className="small-text">Слотов</span>
            </div>
            <div className="detail">
              <span className="big-text">+30 кг</span>
              <span className="small-text">Объём</span>
            </div>
          </div>
        </div>
      </div>
      { showAcceptMenu && (
        <AcceptMenu
          title='Донат слоты'
          description='Вы желаете приобрести дополнительные донат-слоты в инвентарь за 700 R?'
          acceptBtn='Купить за 700 R'
          cancelBtn='Закрыть'
          onClick={handleAccept}
          onCancel={handleClose}
        />
      ) }
    </>
  )
}

export default BuyDonatSlots