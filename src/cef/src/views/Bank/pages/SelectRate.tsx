import './assets/styles/compiled-css/SelectRate.css'
import { formatedMoney } from "../../../modules/formatedMoney.ts";
import { useState, useMemo } from "react";

import MainBtn from "../../../components/MainBtn/MainBtn.tsx";

interface IRate {
  key: string,
  advantages: string[],
  price: number,
}

interface ISelectRate {
  handleNextTypeCard: (selectedType?: string, pincode?: number) => void
}

const SelectRate = ({ handleNextTypeCard }: ISelectRate) => {
  const [selectedRate, setSelectedRate] = useState<string>('nova')

  const ratesConfig: IRate[] = [
    {
      key: 'executive',
      advantages: [
        'Хранение до $200.000 на счету',
        'Снятие до $100.000 за день',
        'Перевод до $30.000 за 1 операцию'
      ],
      price: 400
    },
    {
      key: 'nova',
      advantages: [
        'Хранение до $30.000 на счету',
        'Снятие до $20.000 за день',
        'Перевод до $2.500 за 1 операцию'
      ],
      price: 50
    },
    {
      key: 'platinum',
      advantages: [
        'Хранение до $10.000.000 на счету',
        'Снятие до $2.500.000 за день',
        'Перевод до $200.000 за 1 операцию'
      ],
      price: 1000
    },
  ]

  const handleApplyCard = () => {
    handleNextTypeCard(selectedRate)
  }

  return (
    <section className="select-rate">
      <ul className="list-rates">
        { ratesConfig.map((rate: IRate, idx: number) => (
          <div
            className={`rate-card ${rate.key === selectedRate ? 'selected' : ''}`}
            onClick={() => setSelectedRate(rate.key)}
            key={idx}
          >
            <img className='img-card' src={`assets/img/bank/rates/${rate.key}.png`} />
            <span className="title">{rate.key.charAt(0).toUpperCase() + rate.key.slice(1)}</span>
            <ul className="advantages-list">
              { rate.advantages.map((advantage: string, idx: number) => (
                <span className="advantage">{advantage}</span>
              )) }
            </ul>
            <div className="price-card">
              <span className="price">${formatedMoney(rate.price)}</span>
              <span className="subtitle"> / оформление</span>
            </div>
          </div>
        )) }
      </ul>
      <MainBtn
        text='Далее'
        onClick={handleApplyCard}
        nextIcon={true}
        textSize={.95}
      />
    </section>
  )
}

export default SelectRate