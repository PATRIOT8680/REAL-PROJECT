import './assets/styles/compiled-css/Vehicles.css'
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

const VehiclesPage = () => {
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const [searchValue, setSearchValue] = useState<string>('')
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
  )
}

export default VehiclesPage