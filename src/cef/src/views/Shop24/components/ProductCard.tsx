import './assets/styles/compiled-css/ProductCard.css'
import { IProductCard } from "../../../actions/menus/shop24.ts";
import { CDN_URL } from "../../../main.tsx";
import { formatedMoney } from "../../../modules/formatedMoney.ts";

const ProductCard = ({ id, type, name, description, weight, price }: IProductCard) => {
  return (
    <div className="product-card">
      <div className="img-block">
        <img src={`${CDN_URL}/img/items/${type}/${id}.png`} alt={`IMG-${name}`} />
      </div>
      <span className="name-product">{ name }</span>
      <button className="add-in-cart">
        <span className="price-product">${ formatedMoney(price) }</span>
        <svg className='icon-cart' width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.88886 6.7201C9.34705 6.7201 9.75025 6.46962 9.95796 6.09085L12.1451 2.12599C12.3711 1.72279 12.0778 1.22184 11.6136 1.22184H2.57196L1.9977 0H0V1.22184H1.22184L3.42114 5.8587L2.5964 7.34934C2.15043 8.16797 2.73691 9.16377 3.66551 9.16377H10.9965V7.94193H3.66551L4.33752 6.7201H8.88886ZM3.15234 2.44367H10.575L8.88886 5.49826H4.60021L3.15234 2.44367ZM3.66551 9.77469C2.9935 9.77469 2.44978 10.3245 2.44978 10.9965C2.44978 11.6685 2.9935 12.2184 3.66551 12.2184C4.33752 12.2184 4.88734 11.6685 4.88734 10.9965C4.88734 10.3245 4.33752 9.77469 3.66551 9.77469ZM9.77469 9.77469C9.10268 9.77469 8.55896 10.3245 8.55896 10.9965C8.55896 11.6685 9.10268 12.2184 9.77469 12.2184C10.4467 12.2184 10.9965 11.6685 10.9965 10.9965C10.9965 10.3245 10.4467 9.77469 9.77469 9.77469Z" fill="white" />
        </svg>
      </button>
    </div>
  )
}

export default ProductCard