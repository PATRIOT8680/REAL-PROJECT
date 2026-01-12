import './assets/styles/compiled-css/Header.css'

import MoneyV1 from "../../../components/MoneyV1/MoneyV1.tsx";
import IndicatorsPlayer from "../../../components/IndicatorsPlayer/Index.tsx";

interface IHeader {
  closeInventory: () => void
}

const Header = ({ closeInventory }: IHeader) => {
  return (
    <header className="header-inventory">
      <div className="left-sect">
        <span className="title">Инвентарь</span>
        <MoneyV1 />
      </div>
      <IndicatorsPlayer />
      <div className="esc-exit" onClick={closeInventory}>
        <span className="keybind">ESC</span>
        <span className="description">Выйти</span>
      </div>

    </header>
  )
}

export default Header