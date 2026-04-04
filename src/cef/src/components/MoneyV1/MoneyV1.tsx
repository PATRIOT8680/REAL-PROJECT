import './assets/styles/compiled-css/Money.css'
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { formatedMoney } from "../../modules/formatedMoney.ts";
import AnimatedNumber from "../AnimatedNumber.tsx";

import svg_bankmoney from './assets/img/bankmoney.svg'

const MoneyV1 = () => {
  const cashState = useSelector((state: RootState) => state.cashReducer)
  const bankMoneyState = useSelector((state: RootState) => state.bankMoneyReducer)

  return (
    <div className="money-block">
      <AnimatedNumber
        value={cashState} className='cash'
        format={true} prefix='$'
        duration={500}
      />
      <div className="bankmoney">
        <img src={svg_bankmoney} className="icon-bankmoney"/>
        <AnimatedNumber
          value={bankMoneyState} className='text'
          format={true}
          duration={500}
        />
      </div>
    </div>
  )
}

export default MoneyV1