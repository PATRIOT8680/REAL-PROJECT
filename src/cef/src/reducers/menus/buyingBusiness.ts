import { IBuyingBusiness } from "../../actions/menus/buyingBusiness.ts";

const initialState = {
  isVisible: false,
  infoBusiness: {
    id: 0,
    name: 'Quickstop 24/7',
    owner: 'gov',
    price: 155000,
    markup: 10
  } as IBuyingBusiness
}

export const buyingBusinessReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_BUYING_BUSINESS':
      return {
        isVisible: true,
        infoBusiness: action.infoBusiness
      }
    case 'HIDE_BUYING_BUSINESS':
      return { isVisible: false }
    default:
      return state
  }
}