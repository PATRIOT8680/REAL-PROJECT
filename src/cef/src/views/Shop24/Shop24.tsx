<<<<<<< HEAD
import "./assets/styles/compiled-css/Shop24.css";
import { rce } from "../../modules/rce.ts";
import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { IProductCard, ICartItem } from "../../actions/menus/shop24.ts";
=======
import './assets/styles/compiled-css/Shop24.css'
import { rce } from "../../modules/rce.ts";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { IProductCard } from "../../actions/menus/shop24.ts";
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

import HeaderMenus from "../../components/HeaderMenus/HeaderMenus.tsx";
import TypesGoods from "./components/TypesGoods.tsx";
import ProductCard from "./components/ProductCard.tsx";
<<<<<<< HEAD
import GoodsList from "./components/GoodsList.tsx";
import Cart from "./components/Cart.tsx";
import useSmoothWheelScroll from "../../hooks/useSmoothScroll.ts";

const Shop24 = () => {
  const goods = useSelector((state: RootState) => state.shop24Reducer.products);
  const [selectedType, setSelectedType] = useState<string>("foods");
  const [cart, setCart] = useState<ICartItem[]>([]);

  const filteredGoods = useMemo(() => {
    if (!goods) return [];
    return goods.filter(
      (product: IProductCard) => product.type === selectedType,
    );
  }, [goods, selectedType]);

  const handleSelectType = (type: string) => setSelectedType(type);

  const closeShopMenu = useCallback(() => {
    rce.triggerClient("closeShop24Menu");
  }, []);

  const addToCart = useCallback((product: IProductCard) => {
    setCart((prev) => {
      const existing = prev.findIndex((item) => item.id === product.id);

      if (existing !== -1) {
        return prev.map((item, idx) =>
          idx === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { ...product, quantity: 1 } as ICartItem];
    });
  }, []);

  return (
    <div className="shop24-menu">
      <HeaderMenus title="QuickStop 24/7" handleClose={closeShopMenu} />
      <section className="section-shop24">
        <TypesGoods
          selectedType={selectedType}
          handleSelectType={handleSelectType}
        />
        <div className="main-content">
          <GoodsList goods={filteredGoods} onAddToCart={addToCart} />
          <Cart cart={cart} setCart={setCart} />
        </div>
      </section>
    </div>
  );
};

export default Shop24;
=======

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
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
