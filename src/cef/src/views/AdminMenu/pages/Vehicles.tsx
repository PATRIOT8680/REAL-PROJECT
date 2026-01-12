import './assets/styles/compiled-css/Vehicles.css'

import { vehiclesList } from "./assets/conf/vehiclesList.ts";
import {useState, useMemo, useEffect} from "react";
import { rce } from "../../../modules/rce.ts";
import { CDN_URL } from "../../../main.tsx";

import LoadingComponent from "../components/Loading.tsx";

import search_svg from './assets/img/search.svg'
import loading_svg from "./assets/img/loading.svg"

const VehiclesPage = () => {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectCategory, setSelectCategory] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const preloadImgs = () => {
      const allVehicles = Object.values(vehiclesList).flat() as string[]

      const promises = allVehicles.map((veh) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = `${CDN_URL}/img/vehicles-gta/${veh}.png`
        })
      })

      Promise.all(promises).then(() => {
        setIsLoading(false)
      }).catch(() => {
        setIsLoading(false)
      })
    }

    preloadImgs()
  }, [vehiclesList])

  const colors = [
    { name: 'white', color: [255, 255, 255] },
    { name: 'black', color: [0, 0, 0] },
    { name: 'red', color: [222, 15, 24] },
    { name: 'yellow', color: [251, 226, 18] },
    { name: 'blue', color: [66, 113, 225] },
    { name: 'green', color: [152, 210, 35] },
  ]

  const handleSelectColor = (vehicleName: string, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [vehicleName]: color
    }))
  }

  const getSelectedColor = (vehicleName: string) => {
    return selectedColors[vehicleName] || 'white'
  }

  const getSelectedColorCode = (vehicleName: string): number[] => {
    const colorName = selectedColors[vehicleName] || 'white'
    const colorObj = colors.find(color => color.name === colorName)
    return colorObj ? colorObj.color : [255, 255, 255]
  }

  const getPlayerId = (vehicleName: string) => {
    return playerId[vehicleName]
  }

  const handleSelectCategory = (category: string) => {
    setSelectCategory(category)
    setSearchValue(`#${category}`)
  }

  const clearSearch = () => {
    setSearchValue('')
    setSelectCategory(null)
  }

  const handlePlayerId = (vehicleName: string, id: string) => {
    setPlayerId(prev => ({
      ...prev,
      [vehicleName]: id
    }))
  }


  const handleSpawn = (modelName: string) => {
    const currentPlayerId = getPlayerId(modelName)
    const currentColorRGB = getSelectedColorCode(modelName)

    if (!currentPlayerId) return window.App.sendNotifyReducer.sendNotify('err', 'Укажите ID игрока!', 3000, 'top')

    if (!/^\d+$/.test(currentPlayerId)) {
      return window.App.sendNotifyReducer.sendNotify('err', 'Неверный формат ID!', 3000, 'top')
    }

    rce.triggerServer('cef:amenu:spawnVeh', currentPlayerId, modelName, currentColorRGB)
  }

  const handleSpawnForMe = (modelName: string) => {
    const currentColorRGB = getSelectedColorCode(modelName)
    rce.triggerServer('cef:amenu:spawnVehForMe', modelName, currentColorRGB)
  }

  const filteredListVehs = useMemo(() => {
    if (searchValue.startsWith('#')) {
      const categorySearch = searchValue.slice(1).toLowerCase()

      return Object.entries(vehiclesList).reduce((acc, [category, vehicles]) => {
        if (category.toLowerCase().includes(categorySearch)) {
          acc[category] = vehicles
        }
        return acc
      }, {} as { [key: string]: string[] })
    }

    if (searchValue.trim()) {
      return Object.entries(vehiclesList).reduce((acc, [category, vehicles]) => {
        const filteredVehs = vehicles.filter(veh => {
          return veh.toLowerCase().includes(searchValue.toLowerCase())
        })

        if (filteredVehs.length > 0) {
          acc[category] = filteredVehs
        }

        return acc
      }, {} as { [key: string]: string[] })
    }

    return vehiclesList
  }, [searchValue, vehiclesList])

  const hasSearchResults = Object.values(filteredListVehs).some((vehicles: any) => vehicles.length > 0)

  if (isLoading) {
    return (
        <LoadingComponent />
    )
  }

  return (
    <>
      <div className="vehicles-page">
        <div className="input-search">
          <img src={search_svg} />
          <input
              type="text" className="search-veh"
              value={searchValue}
              onChange={ (e) => setSearchValue(e.target.value) }
              placeholder='Введите название транспорта или #категорию...'
          />
          {searchValue && (
            <button className="clear-search" onClick={clearSearch}>×</button>
          )}
        </div>
        <header className="category-select">
          { Object.entries(vehiclesList).map(([category], key) => (
            <span className="category-btn" onClick={() => handleSelectCategory(category)}>
              { category }
            </span>
          )) }
        </header>

        { !hasSearchResults ? (
            <div className="no-results">
              <p>Транспорт не найден. Попробуйте другой запрос.</p>
              <button onClick={clearSearch}>Показать все</button>
            </div>
        ) : (
            Object.entries(filteredListVehs).map(([category, vehicles], key) => (
              <>
                <div className="category-veh" key={key}>
                  <div className="header-category">
                    <span className="category-name">{category}</span>
                    <div className="line"></div>
                  </div>
                  <ul className="list-vehs">
                    { vehicles.map((veh: any, index) => {
                      const currentColor = getSelectedColor(veh)
                      const currentPlayerId = getPlayerId(veh)

                      return (
                          <li className="veh-card" key={index}>
                            <div className="img-box">
                              <img src={`${CDN_URL}/img/vehicles-gta/${veh}.png`} loading="lazy"/>
                            </div>
                            <div className="line1">
                              <span className="veh-name">{veh.toLowerCase()}</span>
                              <input
                                  type="text" className="player-id"
                                  placeholder='ID игрока'
                                  value={currentPlayerId}
                                  onChange={(e) => handlePlayerId(veh, e.target.value)}
                              />
                            </div>
                            <ul className="colors">
                              {colors.map((color, idx) => (
                                  <li
                                      className={`color-btn ${color.name === currentColor ? 'select' : ''}`}
                                      onClick={() => handleSelectColor(veh, color.name)}
                                      style={{
                                        border: '2px solid ' + `rgb(${color.color.join(',')})`,
                                        background: `rgb(${color.color.join(',')}, 0.75)`
                                      }}
                                  ></li>
                              ))}
                            </ul>
                            <div className="btns-action">
                              <button className="spawn" onClick={() => handleSpawn(veh)}>Заспавнить</button>
                              <button className="spawn" onClick={() => handleSpawnForMe(veh)}>Для себя</button>
                            </div>
                          </li>
                      )
                    }) }
                  </ul>

                </div>
              </>
          ))
        ) }

      </div>
    </>
  )
}

export default VehiclesPage