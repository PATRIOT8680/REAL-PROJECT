import { store } from "../store.ts";
import { showShop24, hideShop24, addProduct, setProducts } from "../../actions/menus/shop24.ts";
import { IProductCard } from "../../actions/menus/shop24.ts";

export const shop24Store = {
  showShop: (id: number, products: IProductCard[]) => store.dispatch(showShop24(id, products)),
  setProducts: (products: IProductCard[]) => store.dispatch(setProducts(products)),
  addProduct: (product: IProductCard) => store.dispatch(addProduct(product)),
  hideShop: () => store.dispatch(hideShop24())
}