import './assets/styles/compiled-css/Index.css'
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import OverMinimap from "./components/OverMinimap.tsx";
import MoneyVoice from "./components/MoneyVoice.tsx";
import HoverInteraction from "./components/HoverInteraction.tsx";
import Speedometer from "./components/Speedometer.tsx";
import ServerInfo from "./components/ServerInfo.tsx";
import BindsSection from "./components/BindsSection.tsx";
import Hint from "./components/Hint.tsx";
import Fuel from "./components/Fuel.tsx";

const Hud = memo(() => {
  const hudState = useSelector((state: RootState) => state.hudReducer)
  const hoverVisible = useSelector((state: RootState) => state.hoverInteractionReducer.isVisible)

  return (
    <>
      <div className="hud">
        <OverMinimap />
        <MoneyVoice />
        <ServerInfo />
        { hudState.bindsVisible && <BindsSection /> }
        { hoverVisible && <HoverInteraction /> }
        { hudState.hintVisible && <Hint /> }
        <div className="vehicle-section">
          { hudState.speedometerVisible && <Fuel /> }
          { hudState.speedometerVisible && <Speedometer /> }
        </div>
      </div>
    </>
  )
})

export default Hud