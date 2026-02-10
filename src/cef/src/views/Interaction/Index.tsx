import './assets/styles/compiled-css/Index.css'

import { useState } from "react";
import { rce } from "../../modules/rce.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

const Interaction = () => {
  const interactionState = useSelector((state: RootState) => state.interactionReducer);
  const [openedCategory, setOpenedCategory] = useState<string>(interactionState.typeEntity === 'player' ? 'social' : 'toggle')
  const [closedCategory, setClosedCategory] = useState<string>('')

  const listInteractions = {
    player: [
      {
        nameSection: 'Социальное',
        key: 'social',
        actions: [
          { name: 'Познакомиться', key: 'acquaint' },
          { name: 'Передать наличные', key: 'cash' },
          { name: 'Обменяться', key: 'trade' },
        ]
      },
      {
        nameSection: 'Документы',
        key: 'documents',
        actions: [
          { name: 'Показать паспорт', key: 'passport' },
          { name: 'Показать лицензии', key: 'license' },
        ]
      }
    ],

    vehicle: [
      {
        nameSection: 'Открыть / закрыть',
        key: 'toggle',
        actions: [
          { name: 'Двери', key: 'toggleDoors' },
          { name: 'Багажник', key: 'toggleTrunk' },
          { name: 'Капот', key: 'toggleHood' },
        ]
      },
      {
        nameSection: 'Осмотр',
        key: 'inspect',
        actions: [
          { name: 'Содержимое багажника', key: 'viewTrunk' },
          { name: 'Состояние т/с', key: 'checkCondition' },
        ]
      },
      {
        nameSection: 'Обслуживание',
        key: 'service',
        actions: [
          { name: 'Починить', key: 'repair' },
          { name: 'Заправить', key: 'refuel' },
          { name: 'Продать', key: 'sell' },
        ]
      },
    ]
  }

  const currentInteractions = interactionState.typeEntity === 'player' ? listInteractions.player : listInteractions.vehicle

  const handleActionInteraction = (action: string) => {
    rce.triggerClient('handleActionInteraction', interactionState.typeEntity, action, interactionState.targetId)
  }

  const handleSelectCategory = (category: string) => {
    if (openedCategory === category) {
      setClosedCategory(category)
      setTimeout(() => {
        setOpenedCategory('')
        setClosedCategory('')
      }, 400)

      return
    }
    if (openedCategory) {
      setClosedCategory(openedCategory)
      setTimeout(() => {
        setOpenedCategory(category)
        setClosedCategory('')
      }, 400)
    } else {
      setOpenedCategory(category)
    }
  }

  return (
    <ul className="interaction-menu">
      { interactionState.typeEntity === 'player' && (
        <span className="id-player">Взаимодействие с ID: {interactionState.targetId}</span>
      ) }
      {currentInteractions.map((category, key) => (
        <div className={`block-item ${category.key === openedCategory ? 'opened' : ''}`} key={key}>
          <li className="category-int" onClick={() => handleSelectCategory(category.key)}>
            <div className="left-el">
              <img src={`assets/img/interaction/${interactionState.typeEntity}/${category.key}.svg`} />
              <span className="name-category">{category.nameSection}</span>
            </div>
            <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 2L11.5 11.6L2 2M2 18H21" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </li>
          { ((openedCategory || closedCategory) && openedCategory === category.key) && (
            <ul className={`list-actions ${
              closedCategory ? 'closing' : openedCategory ? 'opened' : ''
            }`}>
              {category.actions.map((action, key) => (
                <li className='action-int' key={key} onClick={() => handleActionInteraction(action.key)}>
                  <img src={`assets/img/interaction/${interactionState.typeEntity}/${category.key}/${action.key}.svg`} />
                  <span className="name-action">{action.name}</span>
                </li>
              ))}
            </ul>
          ) }
        </div>
      ))}
    </ul>
  )
}

export default Interaction