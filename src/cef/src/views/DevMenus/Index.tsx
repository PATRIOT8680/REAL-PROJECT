import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";

import NewRent from "./NewRent/NewRent.tsx";
import CreateBusiness from "./CreateBusiness/CreateBusiness.tsx";

const DevMenus = () => {
  const devMenusState = useSelector((state: RootState) => state.devMenusReducer)

  return (
    <>
      { devMenusState.newRentVisible && <NewRent /> }
      { devMenusState.createBusinessVisible && <CreateBusiness /> }
    </>
  )
}

export default DevMenus