import './assets/styles/compiled-css/Index.css'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { hideCreateBusiness } from "../../../actions/menus/dev-menus/createBusiness.ts";
import { displayFormatedPrice, stripNonDigits } from "../../../hooks/displayFormatedPrice.ts";

import Input from "../../../components/Input/Input.tsx"
import Slider from "../../../components/Slider/Slider.tsx";
import Select from "../../../components/Select/Select.tsx";
import {rce} from "../../../modules/rce.ts";

export const CreateBusiness = () => {
  const dispatch = useDispatch()
  const [owner, setOwner] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('shop24')
  const [price, setPrice] = useState<string>('')
  const [markup, setMarkup] = useState<number>(0)
  const [balance, setBalance] = useState<string>('')
  const [idBusiness, setIdBusiness] = useState<string>('')

  const typesBusinesses = [
    { key: 'shop24', name: 'QuickStop 24/7' },
    { key: 'gas_station', name: 'Заправка Thunder' },
    { key: 'clothes_shop', name: 'Магазин одежды Style Forge' },
    { key: 'car_showroom', name: 'Автосалон Velocity' },
  ]

  const handleCloseMenu = () => {
    rce.triggerClient('closeDevMenu')
    window.App.devMenusReducer.hideCreateBusiness()
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripNonDigits(e.target.value)
    setPrice(raw)
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripNonDigits(e.target.value)
    setBalance(raw)
  }

  const handleCreateBusiness = () => {
    if (!owner || (owner === 'gov' || (owner !== 'gov' && typeof Number(owner) !== 'number'))) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите владельца (gov или sid игрока)', 4000, 'top')
      return
    }

    const priceBusiness = Number(price)
    if (priceBusiness <= 0) {
      window.App.sendNotifyReducer.sendNotify('err', 'Стоимость бизнеса должна быть больше $0', 3200, 'top')
      return
    }

    const balanceBusiness = Number(balance)
    if (balanceBusiness < 0) {
      window.App.sendNotifyReducer.sendNotify('err', 'Баланс не может быть отрицательным!', 3200, 'top')
      return
    }

    const dataNewBusiness = {
      owner: owner === 'gov' ? owner : Number(owner),
      type: selectedType,
      price: priceBusiness,
      markup: markup,
      balance: balanceBusiness
    }

    rce.triggerServer('createBusiness', dataNewBusiness)
  }

  return (
    <>
      <div className="dev-menus-business">
        <div className="dev-create-business">
          <header className="header-new-business">
            <span className="name-dev-menu">Creating a business</span>
          </header>
          <section className="sect-new-business">
            <span className="name-section">Place of purchase</span>
            <Input
              type='text' value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder={`Owner ('gov' or sid)`} maxLength={50}
            />
            <Select
              selected={selectedType}
              onChange={setSelectedType}
              options={typesBusinesses}
              label='Type of business'
            />
            <Input
              type='number' value={displayFormatedPrice(price)}
              onChange={handlePriceChange}
              placeholder='Price' maxLength={50}
            />
            <Slider
              title='Markup' value={markup}
              onChange={(value) => setMarkup(value)}
              minVal={0} maxVal={50} step={1} enterInput={false} random={false}
              subtitleOne='0%' subtitleTwo='50%'
              showedValues={true}
            />
            <Input
              type='number' value={displayFormatedPrice(balance)}
              onChange={handleBalanceChange}
              placeholder='Balance' maxLength={50}
            />
            <button className='confirm-data' onClick={handleCreateBusiness}>Create business</button>
          </section>
        </div>
        <div className="dev-create-business">
          <header className="header-new-business">
            <span className="name-dev-menu">Create a point for business</span>
            <span className="close-menu" onClick={handleCloseMenu}>X</span>
          </header>
          <section className="sect-new-business">
            <Input
              type='number' value={idBusiness}
              onChange={(e) => setIdBusiness(e.target.value)}
              placeholder='ID Business' maxLength={50}
            />
            <button className='confirm-data'>Link to business</button>
          </section>
        </div>
      </div>
    </>
  )
}

export default CreateBusiness