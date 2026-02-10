import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import NearMinimap from "./components/NearMinimap.tsx";
import HoverInteraction from "./components/HoverInteraction.tsx";
import Speedometer from "./components/Speedometer.tsx";

const Hud = memo(() => {
  const { speedometerVisible } = useSelector((state: RootState) => state.hudReducer)
  const hoverVisible = useSelector((state: RootState) => state.hoverInteractionReducer.isVisible)

  return (
    <>
      <div className="hud">
        <NearMinimap />
        { hoverVisible && <HoverInteraction /> }
        { speedometerVisible && <Speedometer /> }
      </div>
    </>
  )
})

export default Hud