import './assets/styles/compiled-css/AbsenseBag.css'

import InventorySlot from "./InventorySlot.tsx";

const AbsenseBag = () => {
  return (
    <div className="absense-bag">
      <div className="top-content">
        <div className="info-text">
          <span className="title">Сумка не надета</span>
          <span className="description">Чтобы открыть новые слоты и прибавить вместительность предметов, наденьте сумку</span>
        </div>
        <svg className="shadow-bg-inv" width="509" height="124" viewBox="0 0 509 124" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="254.5" cy="62" rx="254.5" ry="62" fill="#B89D62" fill-opacity="0.38"/>
        </svg>
      </div>
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
    </div>
  )
}

export default AbsenseBag