import './assets/styles/compiled-css/Money.css'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import AnimatedNumber from "animated-number-react"

const Money = () => {
  const cashState = useSelector((state: RootState) => state.cashReducer)
  const bankMoneyState = useSelector((state: RootState) => state.bankMoneyReducer)
  const donatCoinsState = useSelector((state: RootState) => state.donatCoinsReducer)

  const [cashChange, setCashChange] = useState<number | null>(null)
  const [bankChange, setBankChange] = useState<number | null>(null)
  const [showCashBanner, setShowCashBanner] = useState(false)
  const [showBankBanner, setShowBankBanner] = useState(false)

  const prevCashRef = useRef(cashState)
  const prevBankRef = useRef(bankMoneyState)

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  useEffect(() => {
    if (prevCashRef.current !== cashState) {
      const difference = cashState - prevCashRef.current
      setCashChange(difference)
      setShowCashBanner(true)

      const timer = setTimeout(() => {
        setShowCashBanner(false)
      }, 3000)

      prevCashRef.current = cashState

      return () => clearTimeout(timer)
    }
  }, [cashState])


  useEffect(() => {
    if (prevBankRef.current !== bankMoneyState) {
      const difference = bankMoneyState - prevBankRef.current
      setBankChange(difference)
      setShowBankBanner(true)

      const timer = setTimeout(() => {
        setShowBankBanner(false)
      }, 3000)

      prevBankRef.current = bankMoneyState

      return () => clearTimeout(timer)
    }
  }, [bankMoneyState])

  const formatDonat = (donat: number) => `${formatNumber(Number(donat.toFixed(0)))} DC`
  const formatCash = (cashState: number) => `$${formatNumber(Number(cashState.toFixed(0)))}`
  const formatBankMoney = (bankMoneyState: number) => `$${formatNumber(Number(bankMoneyState.toFixed(0)))}`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '-'
    return `${sign}$${formatNumber(Math.abs(value))}`
  }

  return (
    <>
      <div className="money-block">
        <div className="line-money">
          <span className="text-name">Donat coins: </span>
          <AnimatedNumber
            className={'donat'}
            value={donatCoinsState}
            formatValue={formatDonat}
            duration={500}
          />
        </div>
        <div className="line-money">
          <span className="text-name">Cash: </span>
          <AnimatedNumber
              className={'cash'}
              value={cashState}
              formatValue={formatCash}
              duration={500}
          />
          {showCashBanner && cashChange !== null && (
              <div className={`money-banner ${cashChange >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(cashChange)}
              </div>
          )}
        </div>

        <div className="line-money">
          <span className="text-name">Bank money: </span>
          <AnimatedNumber
              className={'bank-money'}
              value={bankMoneyState}
              formatValue={formatBankMoney}
              duration={500}
          />
          {showBankBanner && bankChange !== null && (
              <div className={`money-banner ${bankChange >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(bankChange)}
              </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Money