import { store } from "../store";
import { showBuyingBusiness, hideBuyingBusiness, IBuyingBusiness} from "../../actions/menus/buyingBusiness.ts";

export const buyingBusinessStore = {
  showBuyingBusiness: (infoBusiness: IBuyingBusiness) => store.dispatch(showBuyingBusiness(infoBusiness)),
  hideBuyingBusiness: () => store.dispatch(hideBuyingBusiness()),
}