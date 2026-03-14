import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import NewRent from "./NewRent/NewRent.tsx";

const DevMenus = () => {
  const devMenusState = useSelector((state: RootState) => state.devMenusReducer)

  return (
    <>
      { devMenusState.newRentVisible && <NewRent /> }
    </>
  )
}

export default DevMenus