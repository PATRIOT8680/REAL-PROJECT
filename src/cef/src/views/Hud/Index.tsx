import { memo } from "react";
import NearMinimap from "./components/NearMinimap.tsx";

const Hud = memo(() => {
  return (
    <>
      <div className="hud">
        <NearMinimap />
      </div>
    </>
  )
})

export default Hud