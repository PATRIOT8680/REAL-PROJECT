import './assets/styles/compiled-css/Index.css'
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { ICarData } from "../../reducers/menus/rent.ts";
import { rce } from "../../modules/rce.ts";

import Header from './components/Header.tsx'

const Rent = () => {
  const rentReducer = useSelector((state: RootState) => state.rentReducer)
  const [rentHours, setRentHours] = useState<{[key: number]: number}>({})
  const [activeType, setActiveType] = useState<'cars' | 'moto'>('cars')

  const handleRentCar = (carName: string, price: number, hours: number) => {
    rce.triggerServer('cef:handleRentCar', rentReducer.id, carName, price, hours)
  }

  const updateRentHours = (idx: number, hours: number) => {
    setRentHours(prev => ({
      ...prev,
      [idx]: hours
    }))
  }

  const cancelRentCar = () => {
    rce.triggerServer('cef:cancelRentCar')
    rentReducer.isTakenRent = false
  }

  const closeRentMenu = () => {
    rce.triggerClient('closeRent')
  }

  return(
    <>
      <div className="rent">
        <Header closeRent={closeRentMenu} />
        <div className="left-section">
          <header className="type-vehs">
            <span className={`type ${activeType === 'cars' ? 'active' : ''}`} onClick={() => setActiveType('cars')}>
              Автомобили
            </span>
            <span className={`type ${activeType === 'moto' ? 'active' : ''}`} onClick={() => setActiveType('moto')}>
              Мото-транспорт
            </span>
          </header>
          <ul className="list-vehicles">

          </ul>
        </div>
      </div>
    </>
  )
}

export default Rent