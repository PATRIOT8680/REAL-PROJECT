import './assets/styles/compiled-css/HeaderMenus.css'
import { memo } from "react";

import MoneyV1 from "../MoneyV1/MoneyV1.tsx"

interface IHeader {
  title: string
  handleClose: () => void
}

const Header = ({ title, handleClose }: IHeader) => {
  return (
    <header className="header-menus">
      <div className="left-sect">
        <span className="title">{ title }</span>
        <MoneyV1 />
      </div>
      <div className="esc-exit" onClick={handleClose}>
        <span className="keybind">ESC</span>
        <span className="description">Выйти</span>
      </div>
    </header>
  )
}

export default memo(Header)