import './assets/styles/compiled-css/Index.css'

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { ICarData } from "../../actions/menus/rent.ts";
import { rce } from "../../modules/rce.ts";
import { CDN_URL } from "../../main.tsx";
import { formatedMoney } from "../../modules/formatedMoney.ts";

import Header from './components/Header.tsx'

const Rent = () => {
  const rentReducer = useSelector((state: RootState) => state.rentReducer)
  const [rentHours, setRentHours] = useState<{[key: number]: number}>({})
  const [activeType, setActiveType] = useState<'cars' | 'moto'>('cars')

  const currentTypeList = activeType === 'cars'
    ? rentReducer.data.filter((veh: ICarData) => veh.type === 'car')
    : rentReducer.data.filter((veh: ICarData) => veh.type === 'moto')

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
            { currentTypeList.map((item: ICarData, idx: number) => (
                <li className="item-veh" key={idx}>
                  <img src={`${CDN_URL}/img/vehicles-gta/${item.keyNameCar.charAt(0).toUpperCase() + item.keyNameCar.slice(1)}.png`} className="img-veh"/>
                  <div className="info-veh">
                    <span className="fullname-veh">{item.fullNameCar}</span>
                    <span className="price-hour">${formatedMoney(item.price)} / час</span>
                  </div>
                </li>
            )) }
          </ul>
        </div>
      </div>
    </>
  )
}

export default Rent