import { FC } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducer'
import { sys } from '../../../../shared/sys'
import '../assets/styles/compiled-css/Info.css'

interface IInfoDeath {
  killer: string,
  chanceReborn: number,
  timeDead: string
}

const InfoDeath: FC<IInfoDeath> = ({ killer, chanceReborn, timeDead }) => {
  const fate = useSelector((state: RootState) => state.deathReducer.fate)
  
  return (
    <>
      <div className="info-death">
        <div className="header">
          <span className="title" id={`${fate}-title`}>{ fate === 'ems' ? 'Вы вызвали медиков' : 'Вас настигает смерть' }</span>
          <span className="descr">{ fate === 'ems' ? 'Свободные медики примут вызов и приедут на помощь' : 'Если вам никто не поможет, вы окажетесь в реанимации' }</span>
        </div>
        <div className="death-info">
          <div className="line">
            <span className="text">Время потери сознания</span>
            <span className="param">{timeDead}</span>
          </div>
          { killer !== undefined && (
            <div className="line">
              <span className="text">Убил</span>
              <span className="param">{killer}</span>
            </div>
          ) }
        </div>
        <div className="chance-reborn">
          <div className="text-line">
            <span className="title">Вероятность возрождения</span>
            <span className="chance">{chanceReborn}%</span>
          </div>
          <div className="line-chance">
            <div className="bg-line"></div>
            <div className="active-line" style={{ width: `${chanceReborn}%` }}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InfoDeath