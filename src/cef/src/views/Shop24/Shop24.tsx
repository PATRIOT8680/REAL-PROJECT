import "./assets/styles/compiled-css/Shop24.css";
import { rce } from "../../modules/rce.ts";
import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { IProductCard, ICartItem } from "../../actions/menus/shop24.ts";

import HeaderMenus from "../../components/HeaderMenus/HeaderMenus.tsx";
import TypesGoods from "./components/TypesGoods.tsx";
import ProductCard from "./components/ProductCard.tsx";
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
