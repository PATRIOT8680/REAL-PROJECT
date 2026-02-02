import './assets/styles/compiled-css/HoverInteraction.css'

import { useSelector } from "react-redux";
import { RootState} from "../../../reducers/rootReducer.ts";

const HoverInteraction = () => {
  const { hovered } = useSelector((state: RootState) => state.hoverInteractionReducer)

  return (
    <div className={`hover-interaction ${hovered ? 'hovered' : ''}`}>
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="8.5" stroke="white" stroke-opacity="0.2" />
      </svg>
      {hovered && (
        <svg className='point' width="3" height="3" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2" cy="2" r="2" fill="#FFCA58"/>
        </svg>
      )}
    </div>
  )
}

export default HoverInteraction