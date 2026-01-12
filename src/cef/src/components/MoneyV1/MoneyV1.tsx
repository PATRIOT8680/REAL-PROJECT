import './assets/styles/compiled-css/Money.css'
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import svg_bankmoney from './assets/img/bankmoney.svg'

const MoneyV1 = () => {
  const cashState = useSelector((state: RootState) => state.cashReducer)
  const bankMoneyState = useSelector((state: RootState) => state.bankMoneyReducer)

  const formatedMoney = (num: number) => {
    return Intl.NumberFormat('ru-RU').format(num)
  }

  return (
    <div className="money-block">
      <span className="cash">$ {formatedMoney(cashState)}</span>
      <div className="bankmoney">
        <img src={svg_bankmoney} className="icon-bankmoney"/>
        <span className="text">{formatedMoney(bankMoneyState)}</span>
      </div>
    </div>
  )
}

export default MoneyV1