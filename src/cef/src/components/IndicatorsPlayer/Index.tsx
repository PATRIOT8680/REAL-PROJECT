import './assets/styles/compiled-css/Index.css'

import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import svg_eat from './assets/img/eat.svg'
import svg_water from './assets/img/water.svg'
import svg_health from './assets/img/health.svg'
import svg_weight from './assets/img/weight.svg'

const IndicatorsPlayer = () => {
  const { weight } = useSelector((state: RootState) => state.inventoryReducer)
  const playerInfo = useSelector((state: RootState) => state.playerInfoReducer)

  const getDashOffset = (value: number) => {
    const percent = Math.max(0, Math.min(100, value))
    return 480 - (percent / 100) * 240
  }

  const getWeightOffset = () => {
    if (weight) {
      if (weight.max <= 0) return 480
      const percent = (weight.current / weight.max) * 100
      return 480 - (percent / 100) * 240
    }
  }

  return (
    <>
      <div className="indicators-player">
        <div className="indicator" id='eat'>
          <div className="filling-scale">
            <img src={svg_eat} className="icon-indicator"/>
            <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className='path-active' d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" strokeWidth={7}
                strokeDasharray={480}
                strokeDashoffset={getDashOffset(playerInfo.eat)}
              />
              <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7" strokeOpacity={0.07} />
            </svg>
          </div>
          <span className="info-indicator">{playerInfo.eat}</span>
        </div>

        <div className="indicator" id='water'>
          <div className="filling-scale">
            <img src={svg_water} className="icon-indicator"/>
            <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className='path-active' d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" strokeWidth={7}
                    strokeDasharray={480}
                    strokeDashoffset={getDashOffset(playerInfo.water)}
              />
              <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7" strokeOpacity={0.07} />
            </svg>
          </div>
          <span className="info-indicator">{playerInfo.water}</span>
        </div>

        <div className="indicator" id='health'>
          <div className="filling-scale">
            <img src={svg_health} className="icon-indicator"/>
            <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className='path-active' d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" strokeWidth={7}
                    strokeDasharray={480}
                    strokeDashoffset={getDashOffset(playerInfo.health)}
              />
              <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7" strokeOpacity={0.07} />
            </svg>
          </div>
          <span className="info-indicator">{playerInfo.health}</span>
        </div>

        <div className="indicator" id='weight'>
          <div className="filling-scale">
            <img src={svg_weight} className="icon-indicator"/>
            <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className='path-active' d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" strokeWidth={7}
                    strokeDasharray={480}
                    strokeDashoffset={getWeightOffset()}
              />
              <path d="M41 3.5C61.7107 3.5 78.5 20.2893 78.5 41C78.5 61.7107 61.7107 78.5 41 78.5C20.2893 78.5 3.5 61.7107 3.5 41C3.5 20.2893 20.2893 3.5 41 3.5Z" stroke="white" strokeWidth="7" strokeOpacity={0.07} />
            </svg>
          </div>
          <span className="info-indicator">{weight?.current.toFixed(2)} / {weight?.max} кг</span>
        </div>
      </div>
    </>
  )
}

export default IndicatorsPlayer