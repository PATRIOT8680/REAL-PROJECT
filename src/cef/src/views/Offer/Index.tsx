import './assets/styles/compiled-css/Index.css'

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { hideOffer } from "../../actions/menus/offer.ts";

const Offer = () => {
  const dispatch = useDispatch()
  const { isVisible, title, description, duration } = useSelector((state: RootState) => state.offerReducer)
  const [exit, setExit] = useState<boolean>(false)

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setExit(true)

        const hideTimer = setTimeout(() => {
          setExit(false)
          dispatch(hideOffer())
        }, 700)

        return () => clearTimeout(hideTimer)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  if (!isVisible) return null

  return (
    <div className={`offer-menu ${exit ? 'exit' : ''}`}>
      <span className="title">{title}</span>
      <div className="main-info">
        <span className="description">{description}</span>
        <div className="line-duration"
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
      <div className="keys-block">
        <div className="key-info" id='accept'>
          <span className="key">Y</span>
          <span className="descr">Согласиться</span>
        </div>
        <div className="key-info" id='canceled'>
          <span className="key">N</span>
          <span className="descr">Отказаться</span>
        </div>
      </div>
    </div>
  )
}

export default Offer