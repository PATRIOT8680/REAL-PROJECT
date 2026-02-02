import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import NearMinimap from "./components/NearMinimap.tsx";
import HoverInteraction from "./components/HoverInteraction.tsx";
import Speedometer from "./components/Speedometer.tsx";

const Hud = memo(() => {
  const { speedometerVisible } = useSelector((state: RootState) => state.hudReducer)

  return (
    <>
      <div className="hud">
        <NearMinimap />
        <HoverInteraction />
        { speedometerVisible && <Speedometer /> }
      </div>
    </>
  )
})

export default Hud