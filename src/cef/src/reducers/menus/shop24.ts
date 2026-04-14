import { IProductCard } from "../../actions/menus/shop24.ts";

const initialState = {
  isVisible: true,
  id: 0,
  products: [
    {
      id: 1,
      type: 'foods',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      price: 1500,
      weight: 0.2,
    },
    {
      id: 1,
      type: 'foods',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      price: 1500,
      weight: 0.2,
    },
    {
      id: 1,
      type: 'foods',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      price: 1500,
      weight: 0.2,
    },
  ] as IProductCard[]
}

export const shop24Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_SHOP_24':
      return {
        ...state,
        isVisible: true,
        id: action.id,
        products: action.goods
      }
    case 'SET_SHOP24_GOODS':
      return {
        ...state,
        products: action.goods,
      }
    case 'ADD_SHOP24_PRODUCT':
      return {
        ...state,
        product: action.product,
      }
    case 'HIDE_SHOP_24':
      return {
        ...state,
        isVisible: false
      }
    default:
      return state
  }
}