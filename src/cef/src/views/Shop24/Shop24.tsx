import './assets/styles/compiled-css/Shop24.css'
import { rce } from "../../modules/rce.ts";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { IProductCard } from "../../actions/menus/shop24.ts";

import HeaderMenus from "../../components/HeaderMenus/HeaderMenus.tsx";
import TypesGoods from "./components/TypesGoods.tsx";
import ProductCard from "./components/ProductCard.tsx";

const Shop24 = () => {
  const goods = useSelector((state: RootState) => state.shop24Reducer.products)
  const [selectedType, setSelectedType] = useState<string>('foods')

  const handleSelectType = (type: string) => setSelectedType(type)
  const closeShopMenu = () => rce.triggerClient('closeShop24Menu')

  return (
    <div className="shop24-menu">
      <HeaderMenus title='QuickStop 24/7' handleClose={closeShopMenu} />
      <div className="section-shop24">
        <TypesGoods selectedType={selectedType} handleSelectType={handleSelectType} />
        <ul className="list-goods">
          { goods.map((item: IProductCard, idx: number) => (
            <ProductCard
              id={item.id}
              type={item.type}
              name={item.name}
              description={item.description}
              weight={item.weight}
              price={item.price}
              key={idx}
            />
          )) }
        </ul>
      </div>
    </div>
  )
}

export default Shop24