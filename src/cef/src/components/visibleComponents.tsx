import { useSelector } from "react-redux"
import { RootState } from "../reducers/rootReducer";

export const menusWithAmbients = [
  useSelector((state: RootState) => state.welcomeReducer.isVisible),
  useSelector((state: RootState) => state.authReducer.isVisible),
];

const menusWithChangeLanguages = [
  useSelector((state: RootState) => state.welcomeReducer.isVisible),
  useSelector((state: RootState) => state.authReducer.isVisible),
];
export const shouldChangeLanguage = menusWithChangeLanguages.some(visible => visible);