import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../reducers/rootReducer";
import './assets/styles/compiled-css/Index.css'

import { loadingReducer } from "../../reducers/menus/loading";
import { hideLoading } from "../../actions/menus/loading";
import star_svg from './assets/img/star.svg'

const Loading = () => {
  const { t, ready } = useTranslation('loading')
  const loadingState = useSelector((state: RootState) => state.loadingReducer);
  const dispatch = useDispatch()
  const [exit, setExit] = useState(false)

  useEffect(() => {
    if ( loadingState.isVisible && loadingState.duration > 0 ) {
      const timer = setTimeout(() => {
        setExit(true)

        const hideTimer = setTimeout(() => {
          dispatch(hideLoading())
          setExit(false)
        }, 1500)

        return () => clearTimeout(hideTimer)
      }, loadingState.duration)

      return () => clearTimeout(timer)
    }
  }, [loadingState.isVisible, loadingState.duration])

  if (!loadingState.isVisible || !ready) return null;

  return(
    <div className={`loading ${exit ? 'exit' : ''}`}>
      <div className="red_blur"></div>
      <div className="content">
        <div className="loader">
          <img className="star" src={star_svg} />
          <svg className="circle" width="86" height="86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M81 43C81 63.9868 63.9868 81 43 81C22.0132 81 5 63.9868 5 43C5 22.0132 22.0132 5 43 5C63.9868 5 81 22.0132 81 43Z" stroke="#63666E" strokeOpacity="0.5" strokeWidth="10" />
            <path className="active_line" d="M81 43C81 63.9868 63.9868 81 43 81C22.0132 81 5 63.9868 5 43C5 22.0132 22.0132 5 43 5C63.9868 5 81 22.0132 81 43Z" stroke="#FF0C46" strokeWidth="10" />
          </svg>
        </div>
        <div className="text-block">
          <span className="header">
            <span className="main">LOADING</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>

          <span className="description">{t('one-span')}, <br/>{t('two-span')}</span>
        </div>
      </div>
    </div>
  )
}

export default Loading