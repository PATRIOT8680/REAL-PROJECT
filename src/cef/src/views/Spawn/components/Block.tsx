import '../assets/styles/compiled-css/Block.css'
import svg_left_ala from '../assets/img/left-ala.svg'
import svg_right_ala from '../assets/img/right-ala.svg'

interface IBlockSpawn {
  name: string,
  nameKey: string,
  idx: number,
  onClick: (pointSpawn: string) => void,
}

const BlockSpawn = ({ name, nameKey, idx, onClick }: IBlockSpawn) => {
  return (
      <li className="block-spawn" key={idx}>
        <img className='bg-spawn' src={`./assets/img/spawn/${nameKey}.png`} />
        <div className="title-container">
          <span className="subtitle">Точка спавна</span>
          <div className="name-spawn">
            <img src={svg_left_ala} />
            <span className="title">{name}</span>
            <img src={svg_right_ala} />
          </div>
        </div>
        <button className="btn-spawn" onClick={() => onClick(nameKey)}>Заспавниться</button>
      </li>
  )
}

export default BlockSpawn