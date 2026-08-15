import './assets/styles/compiled-css/Vehicles.css'
<<<<<<< HEAD
import { vehiclesList } from "./assets/conf/vehiclesList.ts"
import { useState, useMemo, useCallback, useRef } from "react"
import { useVirtualizer } from '@tanstack/react-virtual'
import { rce } from "../../../modules/rce.ts"
import useSmoothWheelScroll from "../../../hooks/useSmoothScroll.ts";

import VehicleCard from "./Vehicles/VehicleCard.tsx"
import search_svg from './assets/img/search.svg'

const colors = [
  { name: 'white', color: [255, 255, 255] },
  { name: 'black', color: [0, 0, 0] },
  { name: 'red', color: [222, 15, 24] },
  { name: 'yellow', color: [251, 226, 18] },
  { name: 'blue', color: [66, 113, 225] },
  { name: 'green', color: [152, 210, 35] },
]

type CategoryRow = {
  category: string
  vehicles: string[]
}
=======

import { vehiclesList } from "./assets/conf/vehiclesList.ts";
import {useState, useMemo, useEffect} from "react";
import { rce } from "../../../modules/rce.ts";
import { CDN_URL } from "../../../main.tsx";

import LoadingComponent from "../components/Loading.tsx";

import search_svg from './assets/img/search.svg'
import loading_svg from "./assets/img/loading.svg"
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

const VehiclesPage = () => {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const [searchValue, setSearchValue] = useState<string>('')
<<<<<<< HEAD
  const [playerIds, setPlayerIds] = useState<{ [key: string]: string }>({})
  const parentRef = useRef<HTMLDivElement>(null)
  const smoothScrollRef = useSmoothWheelScroll()

  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // @ts-ignore
      parentRef.current = node
      // @ts-ignore
      smoothScrollRef.current = node
    }
  }, [smoothScrollRef])

  const handleSelectColor = useCallback((vehicleName: string, color: string) => {
    setSelectedColors(prev => ({ ...prev, [vehicleName]: color }))
  }, [])

  const getSelectedColorCode = useCallback((vehicleName: string): number[] => {
    const colorName = selectedColors[vehicleName] || 'white'
    return colors.find(c => c.name === colorName)?.color ?? [255, 255, 255]
  }, [selectedColors])

  const handleSelectCategory = useCallback((category: string) => {
    setSearchValue(`#${category}`)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchValue('')
  }, [])

  const handlePlayerIdChange = useCallback((vehicleName: string, id: string) => {
    setPlayerIds(prev => ({ ...prev, [vehicleName]: id }))
  }, [])

  const handleSpawn = useCallback((modelName: string) => {
    const currentPlayerId = playerIds[modelName]
    const currentColorRGB = getSelectedColorCode(modelName)

    if (!currentPlayerId) {
      return window.App.sendNotifyReducer.sendNotify("err", "Укажите ID игрока!", 3000, "top")
    }

    if (!/^\d+$/.test(currentPlayerId)) {
      return window.App.sendNotifyReducer.sendNotify("err", "Неверный формат ID!", 3000, "top")
    }

    rce.triggerServer("cef:amenu:spawnVeh", currentPlayerId, modelName, currentColorRGB)
  }, [playerIds, getSelectedColorCode])

  const handleSpawnForMe = useCallback((modelName: string) => {
    rce.triggerServer("cef:amenu:spawnVehForMe", modelName, getSelectedColorCode(modelName))
  }, [getSelectedColorCode])

  const categoryRows = useMemo<CategoryRow[]>(() => {
    let entries = Object.entries(vehiclesList)

    if (searchValue.startsWith("#")) {
      const q = searchValue.slice(1).toLowerCase()
      entries = entries.filter(([cat]) => cat.toLowerCase().includes(q))
    } else if (searchValue.trim()) {
      const q = searchValue.toLowerCase()
      entries = entries
        .map(([cat, vehs]) => [cat, vehs.filter((v: string) => v.toLowerCase().includes(q))] as [string, string[]])
        .filter(([, vehs]) => vehs.length > 0)
    }

    return entries.map(([category, vehicles]) => ({ category, vehicles }))
  }, [searchValue])

  const virtualizer = useVirtualizer({
    count: categoryRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 2,
  })

  return (
    <div className="vehicles-page">
      <div className="input-search">
        <img src={search_svg} alt="search" />
        <input
          type="text"
          className="search-veh"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Введите название транспорта или #категорию..."
        />
        {searchValue && <button className="clear-search" onClick={clearSearch}>×</button>}
      </div>

      <header className="category-select">
        {Object.keys(vehiclesList).map(cat => (
          <span
            key={cat}
            className="category-btn"
            onClick={() => handleSelectCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </header>

      {categoryRows.length === 0 ? (
        <div className="no-results">
          <p>Транспорт не найден. Попробуйте другой запрос.</p>
          <button onClick={clearSearch}>Показать все</button>
        </div>
      ) : (
        <div
          ref={setRef}
          className='list-all-vehs'
          style={{ height: window.innerHeight - 200, overflow: 'auto', width: '100%' }}
        >
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const row = categoryRows[virtualItem.index]

              return (
                <div
                  className='category-section'
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="category-veh">
                    <div className="header-category">
                      <span className="category-name">{row.category}</span>
                      <div className="line"></div>
                    </div>

                    <ul className="list-vehs">
                      {row.vehicles.map((veh) => (
                        <VehicleCard
                          key={veh}
                          veh={veh}
                          selectedColor={selectedColors[veh] || 'white'}
                          onColorSelect={handleSelectColor}
                          playerId={playerIds[veh] || ''}
                          onPlayerIdChange={handlePlayerIdChange}
                          onSpawn={handleSpawn}
                          onSpawnForMe={handleSpawnForMe}
                          colors={colors}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
=======
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
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  )
}

export default VehiclesPage