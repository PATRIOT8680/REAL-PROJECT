import './assets/styles/compiled-css/GoodsList.css'
import { memo } from "react";
import { IProductCard } from "../../../actions/menus/shop24.ts";
import useSmoothWheelScroll from "../../../hooks/useSmoothScroll.ts";

import ProductCard from "./ProductCard.tsx";

interface GoodsListProps {
  goods: IProductCard[]
  onAddToCart: (product: IProductCard) => void
}

const GoodsList = memo(({ goods, onAddToCart }: GoodsListProps) => {
  const listGoodsRef = useSmoothWheelScroll()

  return (
    <div className="list-goods" ref={listGoodsRef}>
      {goods.map((item, key) => (
        <ProductCard
          key={key}
          {...item}
          onAddToCart={() => onAddToCart(item)}
        />
      ))}
    </div>
  )
})

export default GoodsList