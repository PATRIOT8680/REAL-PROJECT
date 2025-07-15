import { useSelector } from "react-redux"
import { RootState } from "../reducers/rootReducer"

export const useVisibleMenus = () => {
  const menusWithChangeLanguages = [
    useSelector((state: RootState) => state.welcomeReducer.isVisible),
    useSelector((state: RootState) => state.authReducer.isVisible),
  ]

  const menusWithAmbients = [
    useSelector((state: RootState) => state.welcomeReducer.isVisible),
    useSelector((state: RootState) => state.authReducer.isVisible),
  ]

  return {
    shouldChangeLanguage: menusWithChangeLanguages.some(visible => visible),
    shouldPlayAudio: menusWithAmbients.some(visible => visible)
  }
}