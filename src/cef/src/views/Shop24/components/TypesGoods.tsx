import './assets/styles/compiled-css/TypesGoods.css'

interface ITypesGoods {
  selectedType: string,
  handleSelectType: (type: string) => void,
}

const TypesGoods = ({ selectedType, handleSelectType }: ITypesGoods) => {
  const typesGoods = [
    { key: 'foods', name: 'Еда' },
    { key: 'household', name: 'Бытовые' },
    { key: 'tools', name: 'Инструменты' },
    { key: 'various', name: 'Разное' }
  ]

  return (
    <div className="types-goods">
      { typesGoods.map(type => (
        <span
          className={`name-type ${type.key === selectedType ? 'selected' : ''}`}
          onClick={() => handleSelectType(type.key)}
        >
          { type.name }
        </span>
      )) }
    </div>
  )
}

export default TypesGoods