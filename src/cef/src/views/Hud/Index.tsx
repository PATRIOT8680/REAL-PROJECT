import './assets/styles/compiled-css/Index.css'
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import OverMinimap from "./components/OverMinimap.tsx";
import HoverInteraction from "./components/HoverInteraction.tsx";
import Speedometer from "./components/Speedometer.tsx";
import ServerInfo from "./components/ServerInfo.tsx";
import BindsSection from "./components/BindsSection.tsx";

const Hud = memo(() => {
  const hudState = useSelector((state: RootState) => state.hudReducer)
  const hoverVisible = useSelector((state: RootState) => state.hoverInteractionReducer.isVisible)

  return (
    <>
      <div className="hud">
        <OverMinimap />
        <ServerInfo />
        <BindsSection />
        { hoverVisible && <HoverInteraction /> }
        { hudState.speedometerVisible && <Speedometer /> }
      </div>
    </>
  )
})

export default Hud