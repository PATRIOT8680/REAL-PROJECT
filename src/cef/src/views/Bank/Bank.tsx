import './assets/styles/compiled-css/Bank.css'
import { rce } from "../../modules/rce.ts"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import SelectRate from "./pages/SelectRate.tsx";
import Main from "./pages/Main.tsx";
import PinCode from "./pages/PinCode.tsx";

interface INewCard {
  selectedType?: string,
  pincode?: number,
}

const Bank = () => {
  const cardNumber = useSelector((state: RootState) => state.playerInfoReducer.cardNumber)
  const [showedPage, setShowedPage] = useState<string>('select-rate')
  const [infoNewCard, setInfoNewCard] = useState<INewCard | null>(null)

  const handleClose = () => {
    rce.triggerClient('closeBankMenu')
  }

  const handleNextTypeCard = (selectedType?: string, pincode?: number) => {
    if (selectedType) {
      setInfoNewCard({ selectedType: selectedType })
      setShowedPage('pincode')
    } else if (pincode) {
      setShowedPage('main')
    }
  }

  const getCurrentPage = () => {
    switch (showedPage) {
      case 'main':
        return <Main />
      case 'select-rate':
        return <SelectRate handleNextTypeCard={handleNextTypeCard} />
      case 'pincode':
        return <PinCode />
    }
  }

  // useEffect(() => {
  //   if (cardNumber) {
  //     setShowedPage('main')
  //   } else setShowedPage('select-rate')
  // }, [])

  return (
    <div className="bank-menu">
      <header className="header-bank">
        <span className="title">Los Bank</span>
        <div className="esc-exit" onClick={handleClose}>
          <span className="keybind">ESC</span>
          <span className="description">Выйти</span>
        </div>
      </header>
      { getCurrentPage() }
    </div>
  )
}

export default Bank