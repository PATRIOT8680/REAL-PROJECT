import './assets/styles/compiled-css/HeaderMenus.css'
<<<<<<< HEAD
import { memo } from "react";
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

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
<<<<<<< HEAD
=======

>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
    </header>
  )
}

<<<<<<< HEAD
export default memo(Header)
=======
export default Header
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
