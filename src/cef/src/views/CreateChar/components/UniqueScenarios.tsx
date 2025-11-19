import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { rce } from "../../../modules/rce.ts";
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
  const [boughtScens, setBoughtScens] = useState<boolean[]>([false, false])
  const [prices, setPrices] = useState<[number, number]>([850, 850])
  const contentRef = useRef<HTMLDivElement>(null)
  const donatCoinsState = useSelector((state: RootState) => state.donatCoinsReducer)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }

    const getStatusUniqueScens = async () => {
      try {
        const status = await rce.callServer('cef:getStatusUniqueScens')
        if (status) {
          setBoughtScens(status.bought)
          setPrices(status.prices)
        }
      } catch (error) {
        console.error('Ошибка при получении статуса сценариев:', error)
      }
    }

    getStatusUniqueScens()
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

  const isScenarioBought = (scenario: string): boolean => {
    if (scenario === 'walter_white') return boughtScens[0]
    if (scenario === 'crazy_que') return boughtScens[1]
    return false
  }

  const getScenarioPrice = (scenario: string): number => {
    if (scenario === 'walter_white') return prices[0]
    if (scenario === 'crazy_que') return prices[1]
    return 0
  }

  const handleSelectScen = (scenario: string) => {
    if (!isScenarioBought(scenario)) {
      return
    }

    if (scenario === selectedScenarios) {
      setSelectedScenario(undefined)
      return
    }

    setSelectedScenario(scenario)
  }

  const handleBuyScen = async (scenario: string) => {
    if (boughtScens.includes(true)) {
      window.App.sendNotifyReducer.sendNotify('err', 'У вас уже куплен один из уникальных сценариев!', 3500, 'bottom')
      return
    }

    const result = await rce.callServer('cef:buyUniqueScenario', scenario)

    rce.triggerClient('clientCmd', result)

    if (result === 'ok') {
      if (scenario === 'walter_white') {
        setBoughtScens([true, boughtScens[1]])
      } else if (scenario === 'crazy_que') {
        setBoughtScens([boughtScens[0], true])
      }

      setSelectedScenario(scenario)
    }
  }

  const canBuyScenarios = () => {
    return !boughtScens.includes(true)
  }

  return (
      <div
          className={`unique-scenarios-cmpnt ${isExpanded ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnterScenCmpnt}
          onMouseLeave={handelMouseLeaveScenCmpnt}
      >
        <div className="donat-coins-info">
          <span className='descr-dc'>Баланс ➔</span>
          <div className="coins">
            <img className='icon-donat' src={svg_flash} />
            <span className="text-donat">{donatCoinsState}</span>
          </div>
        </div>
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

                {!boughtScens[0] && canBuyScenarios() && (
                    <div className="price-scenarios">
                      <img className='icon-donat' src={svg_flash} />
                      <span className="price-text">{prices[0]}</span>
                    </div>
                )}

                {hoverScen === 'walter_white' && !boughtScens[0] && canBuyScenarios() && (
                    <div className="block-text">
                      <span className="subtitle">Уникальный сценарий</span>
                      <span className="title">Уолтер Уайт</span>
                      <button
                          className="buy-scen"
                          onClick={() => handleBuyScen('walter_white')}
                      >
                        Купить
                      </button>
                    </div>
                )}
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

                {!boughtScens[1] && canBuyScenarios() && (
                  <div className="price-scenarios">
                    <img className='icon-donat' src={svg_flash} />
                    <span className="price-text">{prices[1]}</span>
                  </div>
                )}

                {hoverScen === 'crazy_que' && !boughtScens[1] && canBuyScenarios() && (
                    <div className="block-text">
                      <span className="subtitle">Уникальный сценарий</span>
                      <span className="title">Крейзи Кью</span>
                      <button
                          className="buy-scen"
                          onClick={() => handleBuyScen('crazy_que')}
                      >
                        Купить
                      </button>
                    </div>
                )}
              </div>
            </div>
        ) }

      </div>
  )
}

export default UniqueScenarios