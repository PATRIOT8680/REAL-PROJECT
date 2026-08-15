import './assets/styles/compiled-css/VehicleCard.css'
import { memo, useCallback } from "react"
import { CDN_URL } from "../../../../main.tsx";

interface IVehicleCard {
  veh: string,
  selectedColor: string,
  onColorSelect: (veh: string, color: string) => void,
  playerId: string,
  onPlayerIdChange: (veh: string, id: string) => void,
  onSpawn: (veh: string) => void,
  onSpawnForMe: (veh: string) => void,
  colors: { name: string; color: number[] }[]
}

const VehicleCard = memo(({
    veh,
    selectedColor,
    onColorSelect,
    playerId,
    onPlayerIdChange,
    onSpawn,
    onSpawnForMe,
    colors,
}: IVehicleCard) => {
  const handleColorClick = useCallback((colorName: string) => {
    onColorSelect(veh, colorName)
  }, [veh, onColorSelect])

  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerIdChange(veh, e.target.value)
  }, [veh, onPlayerIdChange])

  const handleSpawnClick = useCallback(() => {
    onSpawn(veh)
  }, [veh, onSpawn])

  const handleSpawnForMeClick = useCallback(() => {
    onSpawnForMe(veh)
  }, [veh, onSpawnForMe])

  return (
    <li className="veh-card">
      <div className="img-box">
        <img
          src={`${CDN_URL}/img/vehicles-gta/${veh}.png`}
          loading="lazy"
          alt={veh}
        />
      </div>
      <div className="line1">
        <span className="veh-name">{veh.toLowerCase()}</span>
        <input
          type="text"
          className="player-id"
          placeholder="ID игрока"
          value={playerId}
          onChange={handleIdChange}
        />
      </div>
      <ul className="colors">
        {colors.map((color) => (
          <li
            key={color.name}
            className={`color-btn ${color.name === selectedColor ? "select" : ""}`}
            onClick={() => handleColorClick(color.name)}
            style={{
              border: `2px solid rgb(${color.color.join(",")})`,
              background: `rgba(${color.color.join(",")}, 0.75)`,
            }}
          />
        ))}
      </ul>
      <div className="btns-action">
        <button className="spawn" onClick={handleSpawnClick}>
          Заспавнить
        </button>
        <button className="spawn" onClick={handleSpawnForMeClick}>
          Для себя
        </button>
      </div>
    </li>
  )
})

export default VehicleCard