export interface IBuyingBusiness {
  id: number,
  name: string,
  owner: string,
  price: number,
  markup: number
}

export const showBuyingBusiness = (infoBusiness: IBuyingBusiness) => {
  return { type: 'SHOW_BUYING_BUSINESS', infoBusiness }
}

export const hideBuyingBusiness = () => {
  return { type: 'HIDE_BUYING_BUSINESS' }
}