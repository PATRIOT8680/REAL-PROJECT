import { useState, useRef, useEffect } from "react"
import './assets/styles/compiled-css/UniqueScenarios.css'

import svg_flash from './assets/img/yellow_flash.svg'

interface IUniqueScenarios {
  selectedScenarios: string | undefined,
  setSelectedScenario: (selectedScenarios: string | undefined) => void,
}

const UniqueScenarios = ({ selectedScenarios, setSelectedScenario }: IUniqueScenarios) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [hoverShopScenarios, setHoverShopScenarios] = useState<boolean>(false)
  const [hoverScen, setHoverScen] = useState<string>('')
  const [activeGif, setActiveGif] = useState<string>('')
  const [contentHeight, setContentHeight] = useState<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [])

  const handleMouseEnterScenCmpnt = () => {
    setHoverShopScenarios(true)
    setIsExpanded(true)
  }

  const handelMouseLeaveScenCmpnt = () => {
    setHoverShopScenarios(false)
    setIsExpanded(false)
  }

  const handleMouseEnter = (scenario: string) => {
    setHoverScen(scenario)
    setActiveGif(scenario)
  }

  const handleMouseLeave = () => {
    setHoverScen('')
    setActiveGif('')
  }

  const getImageSrc = (scenario: string) => {
    if (activeGif === scenario) {
      return `./assets/img/create-char/unique-scens/${scenario}.gif`;
    } else {
      return `./assets/img/create-char/unique-scens/${scenario}.png`;
    }
  }

  const handleSelectScen = (scenario: string) => {
    if (scenario === selectedScenarios) {
      setSelectedScenario(undefined)
      return
    }

    setSelectedScenario(scenario)
  }

  return (
      <div
          className={`unique-scenarios-cmpnt ${isExpanded ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnterScenCmpnt}
          onMouseLeave={handelMouseLeaveScenCmpnt}
      >
        <span className="subtitle-shop">Магазин</span>
        <span className="title-uniq-scens">Уникальные сценарии</span>
        <p className="decr-uniq-scens">У вас есть возможность приобрести уникальные сценарии за донат-валюту. Вам будет доступна уникальная сюжетная линейка</p>


        { hoverShopScenarios && (
            <div className="blocks-scenarios">
              <div className="scenarios"
                   onMouseEnter={() => handleMouseEnter('walter_white')}
                   onMouseLeave={handleMouseLeave}
                   onClick={() => handleSelectScen('walter_white')}
              >
                { selectedScenarios === 'walter_white' && <img className='flash-icon' src={svg_flash} /> }
                <img
                    id='bg-unique'
                    src={getImageSrc('walter_white')}
                    alt="Уолтер Уайт"
                />
                { hoverScen === 'walter_white' && (
                    <div className="block-text">
                      <span className="subtitle">Уникальный сценарий</span>
                      <span className="title">Уолтер Уайт</span>
                    </div>
                ) }
              </div>

              <div className="scenarios"
                   onMouseEnter={() => handleMouseEnter('crazy_que')}
                   onMouseLeave={handleMouseLeave}
                   onClick={() => handleSelectScen('crazy_que')}
              >
                { selectedScenarios === 'crazy_que' && <img className='flash-icon' src={svg_flash} /> }
                <img
                    id='bg-unique'
                    src={getImageSrc('crazy_que')}
                    alt="Крейзи Кью"
                />
                { hoverScen === 'crazy_que' && (
                    <div className="block-text">
                      <span className="subtitle">Уникальный сценарий</span>
                      <span className="title">Крейзи Кью</span>
                    </div>
                ) }
              </div>
            </div>
        ) }

      </div>
  )
}

export default UniqueScenarios