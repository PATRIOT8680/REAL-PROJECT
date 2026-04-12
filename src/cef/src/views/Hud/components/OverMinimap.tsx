import './assets/styles/compiled-css/OverMinimap.css'
import { memo, useState, useEffect, useMemo } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { useMoscowTime } from "../../../hooks/useMoscowTime.ts";

import IndicatorsPlayer from "../../../components/IndicatorsPlayer/Index.tsx";

import svg_location from './assets/img/location.svg'
import svg_time from './assets/img/time.svg'

const OverMinimap = memo(() => {
  const hudState = useSelector((state: RootState) => state.hudReducer)
  const { time, date } = useMoscowTime()

  const nearMinimapStyle = useMemo(() => ({
    position: 'absolute' as const,
    left: `calc(${hudState.rightX}% + 3rem)`,
  }), [hudState.rightX])

  return (
    <>
      <div
        className="near-minimap"
        style={nearMinimapStyle}
      >
        <div className="row-elements">
          <IndicatorsPlayer forInventory={false} />
          <div className="row">
            <div className="block-icon"><img src={svg_time} /></div>
            <div className="info-block">
              <span className="title">{ time }</span>
              <span className="subtitle">{ date }</span>
            </div>
          </div>
          <div className="row">
            <div className="block-icon"><img src={svg_location} /></div>
            <div className="info-block">
              <span className="title">{hudState.area}</span>
              <span className="subtitle">{hudState.street}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default OverMinimap