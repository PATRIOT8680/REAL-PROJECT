import './assets/styles/compiled-css/Index.css'
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { ICarData } from "../../reducers/menus/rent.ts";
import { rce } from "../../modules/rce.ts";
import {number} from "prop-types";

const Rent = () => {
  const rentReducer = useSelector((state: RootState) => state.rentReducer)
  const [rentHours, setRentHours] = useState<{[key: number]: number}>({})

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

  return(
    <>
      <div className="rent">
        <form className="container-rent">
          <div className='bg'>
            <svg id='one_elipse' width="422" height="410" viewBox="0 0 422 410" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="211" cy="205" rx="211" ry="205" fill="#E11D40" fillOpacity="0.23" /></svg>
            <svg id='two_elipse' width="422" height="410" viewBox="0 0 422 410" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="211" cy="205" rx="211" ry="205" fill="#E11D40" fillOpacity="0.23" /></svg>
          </div>
          <div className="header">
            <div className="left">
              <div className="header-2">
                <span>Точка аренды</span>
                { rentReducer.isTakenRent && (<button type='button' onClick={cancelRentCar}>Отменить аренду</button> ) }
              </div>
            </div>
          </div>
          <ul className="list-vehicles">
            { rentReducer.data && rentReducer.data.length > 0 ? (
                rentReducer.data.map((car: ICarData, key: number) => {
                  const hours = rentHours[key] || 1;
                  const totalPrice = car.price * hours

                  return (
                    <li className="car" key={key}>
                      <div className="header-car">
                        <span className="nameCar">Название: {car.nameCar}</span>
                        <span className="price">Цена: ${totalPrice}</span>
                      </div>
                      <div className="bottom-content">
                        <span className="text-renthours">Кол-во часов: {hours} ч.</span>
                        <input type="range" min={1} max={4} value={hours}
                           onChange={(e) => updateRentHours(key, parseInt(e.target.value, 10))} />
                        <button className="btn-rentcar"
                                type="button"
                                onClick={() => handleRentCar(car.nameCar, car.price * hours, hours)}
                        >Взять в аренду
                        </button>
                      </div>
                    </li>
                  )})) : ( <span>Список пуст!</span> ) }
          </ul>
        </form>
      </div>
    </>
  )
}

export default Rent