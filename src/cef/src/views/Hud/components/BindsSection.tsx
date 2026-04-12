import './assets/styles/compiled-css/BindsSection.css'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";

const BindsSection = () => {
  const hudState = useSelector((state: RootState) => state.hudReducer)

  const binds = [
    { key: 'B', label: 'Войс-чат' },
    { key: 'T', label: 'Игровой чат' },
    { key: 'TAB', label: 'Инвентарь' },
    { key: 'E', label: 'Взаимодействие' },
    { key: 'F6', label: 'Репорт-панель' },
    { key: 'F7', label: 'Скрыть подсказки' },
    { key: '2', label: 'Завести двигатель', inVeh: true },
    { key: 'L', label: 'Открыть/закрыть двери', inVeh: true },
  ]

  const visibleBinds = binds.filter(bind => {
    if (bind.inVeh) {
      return hudState.speedometerVisible === true
    }
    return true
  })

  return (
    <div
      className="binds-section"
      style={{
        left: `calc(${hudState.leftX}%`
      }}
    >
      { visibleBinds.map((bind) => (
        <div className="raw-bind" key={bind.key}>
          <span className="key">{bind.key}</span>
          <span className="label">{bind.label}</span>
        </div>
      )) }
    </div>
  )
}

export default BindsSection