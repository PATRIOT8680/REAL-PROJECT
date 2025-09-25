import '../assets/styles/compiled-css/Loading.css'
import loading_svg from "../pages/assets/img/loading.svg";

const LoadingComponent = () => {
  return (
    <>
      <div className="loading-block">
        <img src={loading_svg} className="svg_loading"/>
        <div className="block-text">
          <span>Ожидайте...</span>
          <p>Происходит загрузка контента</p>
        </div>
      </div>
    </>
  )
}

export default LoadingComponent