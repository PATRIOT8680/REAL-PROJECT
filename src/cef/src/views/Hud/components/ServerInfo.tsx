import './assets/styles/compiled-css/ServerInfo.css'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";

import svg_logo from './assets/img/logo.svg'
import svg_online from './assets/img/players.svg'

const ServerInfo = () => {
  const { id, uid } = useSelector((state: RootState) => state.playerInfoReducer)
  const { online } = useSelector((state: RootState) => state.serverInfoReducer)

  return (
    <div className="hud-server-info">
      <div className="bg-blur"></div>
      <img className='server-logo' src={svg_logo} />
      <div className="raw-info">
        <div className="value-info">
          <span className="prefix">ID</span>
          <span className="value">{id}</span>
        </div>
        <div className="value-info">
          <span className="prefix">#</span>
          <span className="value">{uid}</span>
        </div>
        <div className="value-info">
          <img src={svg_online} className="icon-online"/>
          <span className="value">{online}</span>
        </div>
      </div>
    </div>
  )
}

export default ServerInfo