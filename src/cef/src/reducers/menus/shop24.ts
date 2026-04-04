const initialState = {
  isVisible: false,
  id: 0,
  products: [
    {
      key: 'sprunk',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      type: 'food',
      price: 1500,
      weight: 0.2,
    },
    {
      key: 'sprunk',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      type: 'food',
      price: 1800,
      weight: 0.25,
    },
    {
      key: 'sprunk',
      name: 'Спранк',
      description: 'Превращает твой нефритовый стержень в отбойный молоток!',
      type: 'food',
      price: 1700,
      weight: 0.3,
    },
  ]
}

export const shop24Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_SHOP_24':
      return {
        ...state,
        isVisible: true,
        id: action.id,
        products: action.products
      }
    case 'SET_SHOP24_PRODUCTS':
      return {
        ...state,
        products: action.products,
      }
    case 'ADD_SHOP24_PRODUCT':
      return {
        ...state,
        product: action.product,
      }
    case 'HIDE_SHOP_24':
      return {
        isVisible: false
      }
    default:
      return state
  }
}