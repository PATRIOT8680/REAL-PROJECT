import { store } from "../store.ts";
import { showShop24, hideShop24, addProduct, setGoods } from "../../actions/menus/shop24.ts";
import { IProductCard } from "../../actions/menus/shop24.ts";

export const shop24Store = {
  showShop: (id: number, goods: IProductCard[]) => store.dispatch(showShop24(id, goods)),
  setGoods: (goods: IProductCard[]) => store.dispatch(setGoods(goods)),
  addProduct: (product: IProductCard) => store.dispatch(addProduct(product)),
  hideShop: () => store.dispatch(hideShop24())
}