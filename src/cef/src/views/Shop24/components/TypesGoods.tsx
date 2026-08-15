import './assets/styles/compiled-css/TypesGoods.css'
<<<<<<< HEAD
import { memo } from "react";
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

interface ITypesGoods {
  selectedType: string,
  handleSelectType: (type: string) => void,
}

<<<<<<< HEAD
const TypesGoods = memo(({ selectedType, handleSelectType }: ITypesGoods) => {
=======
const TypesGoods = ({ selectedType, handleSelectType }: ITypesGoods) => {
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  const typesGoods = [
    { key: 'foods', name: 'Еда' },
    { key: 'household', name: 'Бытовые' },
    { key: 'tools', name: 'Инструменты' },
<<<<<<< HEAD
    { key: 'misc', name: 'Разное' }
=======
    { key: 'various', name: 'Разное' }
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  ]

  return (
    <div className="types-goods">
<<<<<<< HEAD
      { typesGoods.map((type, key) => (
        <span
          key={key}
=======
      { typesGoods.map(type => (
        <span
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
          className={`name-type ${type.key === selectedType ? 'selected' : ''}`}
          onClick={() => handleSelectType(type.key)}
        >
          { type.name }
        </span>
      )) }
    </div>
  )
<<<<<<< HEAD
})
=======
}
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

export default TypesGoods