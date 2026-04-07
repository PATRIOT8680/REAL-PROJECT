import './assets/styles/compiled-css/BindsSection.css'

const BindsSection = () => {
  const binds = [
    { key: 'B', label: 'Войс-чат' },
    { key: 'T', label: 'Игровой чат' },
    { key: 'TAB', label: 'Инвентарь' },
    { key: 'E', label: 'Взаимодействие' },
    { key: 'F6', label: 'Репорт-панель' },
  ]

  return (
    <div className="binds-section">
      { binds.map((bind) => (
        <div className="raw-bind" key={bind.key}>
          <span className="key">{bind.key}</span>
          <span className="label">{bind.label}</span>
        </div>
      )) }
    </div>
  )
}

export default BindsSection