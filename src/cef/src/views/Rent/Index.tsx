import './assets/styles/compiled-css/Index.css'

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { ICarData } from '../../../../shared/types/rent.ts'
import { rce } from "../../modules/rce.ts";
import { CDN_URL } from "../../main.tsx";
import { formatedMoney } from "../../modules/formatedMoney.ts";
import useSmoothWheelScroll from "../../hooks/useSmoothScroll.ts";
import Slider from "../../components/Slider/Slider.tsx";

import HeaderMenus from "../../components/HeaderMenus/HeaderMenus.tsx";
import PaymentMethods from "../../components/PaymentMethod/PaymentMethods.tsx";
import AnimatedNumber from "../../components/AnimatedNumber.tsx";

const Rent = () => {
  const colorsVeh = [
    { hex: '#d9d9d9', rgb: [217, 217, 217] },
    { hex: '#1a2029', rgb: [26, 32, 41] },
    { hex: '#2e90fa', rgb: [46, 144, 250] },
    { hex: '#dc6803', rgb: [220, 104, 3] },
    { hex: '#f04438', rgb: [240, 68, 56] },
  ]

  const rentReducer = useSelector((state: RootState) => state.rentReducer)
  const [activeType, setActiveType] = useState<'cars' | 'moto'>('cars')
  const [selectedVeh, setSelectedVeh] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>(colorsVeh[0].hex)
  const [time, setTime] = useState<number>(60)
  const listVehRef = useSmoothWheelScroll()

  const currentTypeList = activeType === 'cars'
    ? rentReducer.data.filter((veh: ICarData) => veh.type === 'car')
    : rentReducer.data.filter((veh: ICarData) => veh.type === 'moto')

  const selectedVehicle: ICarData = rentReducer.data.find(
    (veh: ICarData) => veh.keyNameCar === selectedVeh
  )

  const totalPrice = selectedVehicle ? Math.round(selectedVehicle.price * (time / 60)) : 0

  const handleCancelRentVeh = () => {
    rce.triggerClient('cef:cancelRentCar')
  }

  const closeRentMenu = () => {
    rce.triggerClient('closeRentMenu')
  }

  const handleClickPayment = (method: 'cash' | 'bank') => {
    const selectedColorObj = colorsVeh.find(c => c.hex === selectedColor)

    rce.triggerServer('cef:handleRentVeh', rentReducer.id, method, selectedVehicle, selectedColorObj?.rgb, time)
  }

  useEffect(() => {
    if (currentTypeList.length > 0) {
      const firstVehicleKey = currentTypeList[0].keyNameCar
      setSelectedVeh(firstVehicleKey)
    } else {
      setSelectedVeh('')
    }
  }, [activeType, rentReducer.data])

  return(
    <>
      <div className="rent">
        <HeaderMenus title='Аренда транспорта' handleClose={closeRentMenu} />
        <div className="sections-rent">
          <div className="left-section">
            <header className="type-vehs">
            <span className={`type ${activeType === 'cars' ? 'active' : ''}`} onClick={() => setActiveType('cars')}>
              Автомобили
            </span>
              <span className={`type ${activeType === 'moto' ? 'active' : ''}`} onClick={() => setActiveType('moto')}>
              Мото-транспорт
            </span>
            </header>
            <div className="list-vehicles" ref={listVehRef}>
              { currentTypeList.map((item: ICarData, idx: number) => {
                const isSelected = selectedVeh === item.keyNameCar

                return (
                  <li className={`item-veh ${isSelected ? 'selected' : ''}`} key={idx} onClick={() => setSelectedVeh(item.keyNameCar)}>
                    <div className="info-veh">
                      <header className="header-info">
                        <span className="fullname-veh">{item.fullNameCar}</span>
                        <span className="type-fuel">Топливо: {item.typeFuel === 'gas' ? 'бензин' : 'электро'}</span>
                      </header>
                      <span className="price-hour">${formatedMoney(item.price)} <span>/ час</span></span>
                    </div>
                    <img
                      src={`${CDN_URL}/img/vehicles-gta/${item.keyNameCar.charAt(0).toUpperCase() + item.keyNameCar.slice(1)}.png`}
                      className="img-veh"/>
                  </li>
                )
              }) }
            </div>
          </div>
          <div className="right-section">
            { (selectedVeh && selectedVehicle) && (
              <>
                <div className="info-veh">
                  <img
                    src={`${CDN_URL}/img/vehicles-gta/${selectedVeh.charAt(0).toUpperCase() + selectedVeh.slice(1)}.png`}
                    className="img-selected-veh"
                  />
                  <div className="text-block">
                    <div className="header-tb">
                      <span className="description">Выбранный транспорт</span>
                      <span className="fullname-veh">{selectedVehicle.fullNameCar}</span>
                    </div>
                    <span className="type-fuel">Топливо • {selectedVehicle.typeFuel === 'gas' ? 'бензин' : 'электро'}</span>
                  </div>
                </div>
                <div className="colors-veh">
                  <span className="title">Выберите цвет</span>
                  <div className="colors">
                    { colorsVeh.map((color, idx) => (
                      <div
                        className={`circle-color ${selectedColor === color.hex ? 'selected' : ''}`}
                        style={{ background: `${color.hex}` }}
                        onClick={() => setSelectedColor(color.hex)}
                      ></div>
                    )) }
                  </div>
                </div>
                <Slider
                  title={'На сколько минут'}
                  value={time}
                  onChange={(time) => setTime(time)}
                  minVal={20}
                  maxVal={120}
                  step={20}
                  enterInput={false}
                  random={false}
                  subtitleOne={'20 мин'}
                  subtitleTwo={'120 мин'}
                  showedPercents={false}
                  showedValues={true}
                />
                <div className="final-info">
                  <div className="block-info">
                    <span className="descr">За час</span>
                    <AnimatedNumber value={selectedVehicle.price} className='value' prefix='$' format={true} />
                  </div>
                  <div className="block-info">
                    <span className="descr">Минуты</span>
                    <AnimatedNumber value={time} className='value' format={false} duration={200} />
                  </div>
                  <div className="block-info" id='total-amount'>
                    <span className="descr">К оплате</span>
                    <AnimatedNumber value={totalPrice} className='value' prefix='$' format={true} />
                  </div>
                </div>
                { !rentReducer.isTakenRent ? (
                  <PaymentMethods onClick={ (method: 'cash' | 'bank') => handleClickPayment(method) } />
                ) : (
                  <button className="cancel-rent" onClick={handleCancelRentVeh}>Отменить текущую аренду</button>
                )}
              </>
            ) }
          </div>
        </div>
      </div>
    </>
  )
}

export default Rent