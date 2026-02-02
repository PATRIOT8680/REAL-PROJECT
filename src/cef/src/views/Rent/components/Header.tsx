import '../assets/styles/compiled-css/Header.css'

import MoneyV1 from "../../../components/MoneyV1/MoneyV1.tsx";

interface IHeader {
  closeRent: () => void
}

const Header = ({ closeRent }: IHeader) => {
  return (
    <header className="header-rent">
      <div className="left-sect">
        <span className="title">Аренда транспорта</span>
        <MoneyV1 />
      </div>
      <div className="esc-exit" onClick={closeRent}>
        <span className="keybind">ESC</span>
        <span className="description">Выйти</span>
      </div>

    </header>
  )
}

export default Header