import '../assets/styles/compiled-css/InfoChar.css'
import { FC } from "react";
import { ISelectChar } from "../../../actions/menus/select-char.ts";
import { formatedMoney } from "../../../modules/formatedMoney.ts";

interface IInfoChar {
  charData: ISelectChar
}

const InfoChar: FC<IInfoChar> = ({ charData } ) => {

  const fieldsToDisplay = [
    { key: 'cash' as keyof ISelectChar, label: 'Наличные' },
    { key: 'bankmoney' as keyof ISelectChar, label: 'Банковский счет' },
    { key: 'fraction' as keyof ISelectChar, label: 'Фракция' },
    { key: 'family' as keyof ISelectChar, label: 'Семья' }
  ]

  const formatValue = (key: keyof ISelectChar, value: any) => {
    switch (key) {
      case 'cash':
      case 'bankmoney':
        return value ? `$${formatedMoney(value)}` : '$0'
      case 'fraction':
        return value || 'Не состоит'
      case 'family':
        return value || 'Не состоит'
      default:
        return value || '—'
    }
  }

  return (
      <>
        <div className="info-char-cmpnt">
          <span className="title-info">Статистика</span>
          <ul className="list-info">
            {fieldsToDisplay.map((field) => (
                <li key={field.key} className="info-item">
                  <img src={`assets/img/select-char/info-char/${field.key}.svg`} />
                  <div className="text-block">
                    <span className="info-label">{field.label}</span>
                    <span className="info-value">{formatValue(field.key, charData[field.key])}</span>
                  </div>
                </li>
            ))}
          </ul>
        </div>
      </>
  )
}

export default InfoChar