export interface IProductCard {
  key: string,
  name: string,
  description: string,
  type: string,
  price: number,
  weight: number,
}

export const showShop24 = (
  id: number,
  products: IProductCard[]
) => {
  return { type: 'SHOW_SHOP_24', id, products }
}

export const setProducts = (products: IProductCard[]) => {
  return { type: 'SET_SHOP24_PRODUCTS', products }
}

export const addProduct = (product: IProductCard) => {
  return { type: 'ADD_SHOP24_PRODUCT', product }
}

export const hideShop24 = () => {
  return { type: 'HIDE_SHOP_24' }
}