import './assets/styles/compiled-css/TypesGoods.css'
import { memo } from "react";

interface ITypesGoods {
  selectedType: string,
  handleSelectType: (type: string) => void,
}

const TypesGoods = memo(({ selectedType, handleSelectType }: ITypesGoods) => {
  const typesGoods = [
    { key: 'foods', name: 'Еда' },
    { key: 'household', name: 'Бытовые' },
    { key: 'tools', name: 'Инструменты' },
    { key: 'misc', name: 'Разное' }
  ]

  return (
    <div className="types-goods">
      { typesGoods.map((type, key) => (
        <span
          key={key}
          className={`name-type ${type.key === selectedType ? 'selected' : ''}`}
          onClick={() => handleSelectType(type.key)}
        >
          { type.name }
        </span>
      )) }
    </div>
  )
})

export default TypesGoods