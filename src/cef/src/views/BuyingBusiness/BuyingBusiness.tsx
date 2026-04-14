import './assets/styles/compiled-css/BuyingBusiness.css'
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { displayFormatedPrice } from "../../hooks/displayFormatedPrice.ts";
import { rce } from "../../modules/rce.ts";

import svg_business from './assets/img/img-business.svg'
import svg_id from './assets/img/id.svg'
import svg_owner from './assets/img/owner.svg'
import svg_price from './assets/img/price.svg'
import svg_markup from './assets/img/markup.svg'

const BuyingBusiness = () => {
  const infoBusiness = useSelector((state: RootState) => state.buyingBusinessReducer.infoBusiness)
  const owner = infoBusiness.owner === 'gov' ? 'Государство' : `#${infoBusiness.owner}`

  const handleCloseMenu = () => {
    rce.triggerClient('closeInfoBusinessMenu')
  }

  return (
    <div className="buying-business">
      <header className="header-buying">
        <span className="name">{infoBusiness.name}</span>
        <span className="close-menu" onClick={handleCloseMenu}>X</span>
      </header>
      <div className="img-box">
        <img src={svg_business} />
        <div className="text-block">
          <span className="coming-soon">Coming soon...</span>
          <span className="subtitle">Business photo</span>
        </div>
      </div>
      <div className="info-block">
        <div className="raw">
          <div className="icon-part"><img src={svg_id} /></div>
          <span className="name-raw">Номер бизнеса</span>
          <span className="value-raw">№{infoBusiness.id}</span>
        </div>
        <div className="raw">
          <div className="icon-part"><img src={svg_owner} /></div>
          <span className="name-raw">Владелец</span>
          <span className="value-raw">{owner}</span>
        </div>
        <div className="raw">
          <div className="icon-part"><img src={svg_price} /></div>
          <span className="name-raw">Гос. стоимость</span>
          <span className="value-raw">{displayFormatedPrice(infoBusiness.price.toString())}</span>
        </div>
        <div className="raw">
          <div className="icon-part"><img src={svg_markup} /></div>
          <span className="name-raw">Наценка на товары</span>
          <span className="value-raw">{infoBusiness.markup}%</span>
        </div>
      </div>
      { infoBusiness.owner === 'gov' && <button className="start-deal">Начать сделку</button> }
    </div>
  )
}

export default BuyingBusiness