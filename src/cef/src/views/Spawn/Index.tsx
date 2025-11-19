import './assets/styles/compiled-css/Index.css'
import { rce } from "../../modules/rce.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import BlockSpawn from "./components/Block.tsx";

const SpawnMenu = () => {
  const spawnMenuState = useSelector((state: RootState) => state.spawnReducer)

  const listSpawn = [
    { key: 'exit', name: 'Место выхода' },
    { key: 'rent', name: 'Аренда' },
    { key: 'fraction', name: 'Фракция' },
    { key: 'home', name: 'Дом' },
    { key: 'family', name: 'Семья' },
  ]

  const handleClickSpawn = (pointSpawn: string) => {
    rce.triggerServer('handleSpawnPlayer', spawnMenuState.nickName, spawnMenuState.selectedSlot, pointSpawn)
  }

  return (
      <ul className="spawn-menu">
        { listSpawn.map((item, idx) => (
            <BlockSpawn key={item.key} name={item.name} nameKey={item.key} idx={idx} onClick={() => handleClickSpawn(item.key)} />
        )) }
      </ul>
  )
}

export default SpawnMenu