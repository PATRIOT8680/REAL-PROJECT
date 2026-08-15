import './assets/styles/compiled-css/Cart.css'
import { memo, useState, Dispatch, SetStateAction, useMemo } from "react";
import { IProductCard, ICartItem } from "../../../actions/menus/shop24.ts";
import { formatedMoney } from "../../../modules/formatedMoney.ts";
import { CDN_URL } from "../../../main.tsx";
import useSmoothWheelScroll from "../../../hooks/useSmoothScroll.ts";

import AnimatedNumber from "../../../components/AnimatedNumber.tsx";
import PaymentMethods from "../../../components/PaymentMethod/PaymentMethods.tsx";

interface ICart {
  cart: ICartItem[],
  setCart: Dispatch<SetStateAction<ICartItem[]>>,
}

const Cart = ({ cart, setCart }: ICart) => {
  const listGoodsCartRef = useSmoothWheelScroll()
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'bank'>('cash')

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0)
  }, [cart])

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="cart-shop24">
      <span className="title-cart">Корзина</span>
      <div className="list-goods-cart" ref={listGoodsCartRef}>
        {cart.length === 0 && (
          <div className="not-found">
            <svg width="121" height="103" viewBox="0 0 121 103" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.6231 77.5381H103.805C105.848 77.5381 107.63 75.8617 107.63 73.6086C107.63 71.3555 105.848 69.679 103.805 69.679H43.5134C40.525 69.679 38.6907 67.5824 38.2188 64.3882L37.3799 58.8873H103.908C111.563 58.8873 115.495 54.171 116.596 46.6807L120.79 18.966C120.902 18.308 120.972 17.6435 121 16.9766C121 14.462 119.112 12.7319 116.229 12.7319H30.618L29.6203 6.07984C29.0969 2.04524 27.6295 0 22.2835 0H3.87869C1.78277 0 0 1.83736 0 3.93402C0 6.07984 1.78277 7.91497 3.88093 7.91497H21.599L29.9872 65.4366C31.0899 72.8754 35.0201 77.5381 42.6231 77.5381ZM112.086 20.6424L108.369 45.7374C107.948 48.9852 106.219 50.9768 103.125 50.9768L36.2302 51.0282L31.7722 20.6424H112.086ZM46.7658 103C47.8837 103.009 48.9923 102.796 50.0269 102.372C51.0615 101.949 52.0015 101.324 52.792 100.534C53.5826 99.7445 54.2078 98.8052 54.6314 97.7713C55.0549 96.7374 55.2683 95.6297 55.2591 94.5125C55.2641 93.3966 55.0479 92.2907 54.6228 91.2587C54.1978 90.2267 53.5723 89.2891 52.7827 88.5C51.993 87.7108 51.0547 87.0859 50.022 86.6611C48.9892 86.2364 47.8825 86.0203 46.7658 86.0253C41.9968 86.0253 38.221 89.7984 38.221 94.5125C38.221 99.2803 41.9968 103 46.7658 103ZM95.784 103C100.555 103 104.329 99.2803 104.329 94.5125C104.329 89.7962 100.555 86.0253 95.784 86.0253C91.0665 86.0253 87.2393 89.7984 87.2393 94.5125C87.2393 99.2803 91.0665 103 95.784 103Z" fill="white"/>
            </svg>
            <div className="text-block">
              <span className="title">Корзина пуста</span>
              <span className="subtitle">У вас пустая корзина! В левом меню выберете нужные товары и они здесь отобразятся</span>
            </div>
          </div>
        )}
        { cart.map((product: ICartItem, key) => (
          <li className="product-row" key={key}>
            <div className="left-section">
              <div className="img-block">
                <img src={`${CDN_URL}/img/items/${product.type}/${product.id}.png`} alt={`IMG-${product.name}`} />
              </div>
              <div className="text-block">
                <span className="name">{ product.name }</span>
                <span className="price">${ formatedMoney(product.price) }</span>
              </div>
            </div>
            <div className="actions-section">
              <div className="select-quantity">
                <span className="action" onClick={() => updateQuantity(product.id, -1)}>
                  -
                </span>
                <span className="quantity">{ product.quantity }</span>
                <span className="action" onClick={() => updateQuantity(product.id, 1)}>
                  +
                </span>
              </div>
              <div className="remove-item" onClick={() => removeItem(product.id)}>
                <svg width="29" height="37" viewBox="0 0 29 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.7857 12.3333V32.8889H6.21429V12.3333H22.7857ZM19.6786 0H9.32143L7.25 2.05556H0V6.16667H29V2.05556H21.75L19.6786 0ZM26.9286 8.22222H2.07143V32.8889C2.07143 35.15 3.93571 37 6.21429 37H22.7857C25.0643 37 26.9286 35.15 26.9286 32.8889V8.22222Z" fill="white"/>
                </svg>
              </div>
            </div>
          </li>
        )) }
      </div>
      <hr />
      <div className="total-amount">
        <span className="title">Итог</span>
        <AnimatedNumber value={totalAmount} className='value-total' prefix='$' />
      </div>
      <PaymentMethods onClick={(m: 'cash' | 'bank') => setSelectedPayment(m)} />
    </div>
  )
}

export default memo(Cart)