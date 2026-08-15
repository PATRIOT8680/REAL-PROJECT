export interface IProductCard {
  id: number,
  type: string,
  name: string,
  description: string,
  weight: number,
<<<<<<< HEAD
  price: number,
}

export interface ICartItem extends IProductCard {
  quantity: number
=======
  price: number
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

export const showShop24 = (
  id: number,
  goods: IProductCard[]
) => {
  return { type: 'SHOW_SHOP_24', id, goods }
}

export const setGoods = (goods: IProductCard[]) => {
  return { type: 'SET_SHOP24_GOODS', goods }
}

export const addProduct = (goods: IProductCard) => {
  return { type: 'ADD_SHOP24_PRODUCT', goods }
}

export const hideShop24 = () => {
  return { type: 'HIDE_SHOP_24' }
}