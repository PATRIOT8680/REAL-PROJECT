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
      <div className="content">
        <svg className='icon-flash' width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M31.5 0C48.897 0 63 14.103 63 31.5C63 48.897 48.897 63 31.5 63C14.103 63 0 48.897 0 31.5C0 14.103 14.103 0 31.5 0ZM12.8819 35.6382H31.503L29.4349 52.1912L50.1251 27.3628H31.503L33.5722 10.8098L12.8819 35.6382Z" fill="#443F48" />
        </svg>
        <div className="text-block">
          <span className="main">Загрузка...</span>
          <span className="description">Происходит загрузка ресурсов.<br/>Пожалуйста, подождите...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading