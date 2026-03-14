import './assets/styles/compiled-css/Index.css'

import { useState } from "react";
import { useDispatch } from "react-redux";
import { hideNewRent } from "../../../actions/menus/dev-menus/newRent.ts";
import { rce } from "../../../modules/rce.ts";
import Input from "../../../components/Input/Input.tsx";

const NewRent = () => {
  const dispatch = useDispatch()
  const [npcModel, setNpcModel] = useState<string>('')
  const [nameNpc, setNameNpc] = useState<string>('')
  const [typeVeh, setTypeVeh] = useState<'car' | 'moto'>('car')
  const [idRent, setIdRent] = useState<string>('')
  const [vehModel, setVehModel] = useState<string>('')
  const [priceVeh, setPriceVeh] = useState<string>('')

  const handleSelectType = (type: 'car' | 'moto') => {
    if (type === typeVeh) return
    setTypeVeh(type)
  }

  const stripNonDigits = (value: string): string => value.replace(/\D/g, '')

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripNonDigits(e.target.value)
    setPriceVeh(raw)
  }

  const formatPriceDisplay = (raw: string): string => {
    const digits = stripNonDigits(raw)
    if (!digits) return ''

    const number = parseInt(digits, 10)

    return `$${number.toLocaleString('de-DE')}`
  }

  const handleCreateNpc = () => {
    if (!npcModel || !nameNpc) {
      window.App.sendNotifyReducer.sendNotify('err', 'Поля ввода с информацией NPC не должны быть пустыми!', 4000, 'top')
      return
    }

    rce.triggerServer('createNpcForRent', npcModel, nameNpc)
  }

  const handleAddVeh = () => {
    if (!idRent || !vehModel || !priceVeh) {
      window.App.sendNotifyReducer.sendNotify('err', 'Поля ввода с информацией о т/с не должны быть пустыми!', 4000, 'top')
      return
    }

    rce.triggerServer('addVehInRent', Number(idRent), typeVeh, vehModel, Number(priceVeh))
  }

  return (
    <div className="dev-new_rent">
      <header className="header-new-rent">
        <span className="name-dev-menu">Создание аренды</span>
        <span className="close-menu" onClick={() => dispatch(hideNewRent())}>X</span>
      </header>
      <section className="sect-new-rent">
        <span className="name-section">NPC Info</span>
        <Input
          type='text' value={npcModel}
          onChange={(e) => setNpcModel(e.target.value)}
          placeholder='Модель NPC (wiki)' maxLength={50}
        />
        <Input
          type='text' value={nameNpc}
          onChange={(e) => setNameNpc(e.target.value)}
          placeholder='Имя NPC' maxLength={50}
        />
        <button className='confirm-data' onClick={handleCreateNpc}>Create NPC</button>
      </section>
      <hr/>
      <section className="sect-new-rent">
        <span className="name-section">VEH Info</span>
        <div className="btns-type-veh">
          <button className={`btn-type ${typeVeh === 'car' ? 'selected' : ''}`} onClick={() => handleSelectType('car')}>
            car
          </button>
          <button className={`btn-type ${typeVeh === 'moto' ? 'selected' : ''}`} onClick={() => handleSelectType('moto')}>
            moto
          </button>
        </div>
        <Input
          type='text' value={idRent}
          onChange={(e) => setIdRent(e.target.value)}
          placeholder='ID аренды' maxLength={50}
        />
        <Input
          type='text' value={vehModel}
          onChange={(e) => setVehModel(e.target.value)}
          placeholder='Модель т/с' maxLength={50}
        />
        <Input
          type='text' value={formatPriceDisplay(priceVeh)}
          onChange={handlePriceChange}
          placeholder='Цена за час' maxLength={50}
        />
        <button className='confirm-data' onClick={handleAddVeh}>Add veh</button>
      </section>
    </div>
  )
}

export default NewRent