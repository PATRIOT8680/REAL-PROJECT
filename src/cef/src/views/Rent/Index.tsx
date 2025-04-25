import './assets/styles/compiled-css/Index.css'

const Rent = () => {
  return(
    <>
      <div className="rent">
        <form className="container">
          <div className='bg'>
            <svg id='one_elipse' width="422" height="410" viewBox="0 0 422 410" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="211" cy="205" rx="211" ry="205" fill="#E11D40" fill-opacity="0.23" /></svg>
            <svg id='two_elipse' width="422" height="410" viewBox="0 0 422 410" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="211" cy="205" rx="211" ry="205" fill="#E11D40" fill-opacity="0.23" /></svg>
          </div>
          <div className="header">
            <div className="left">
              <div className="header-2">
                <span>Точка аренды</span>
              </div>
            </div>
          </div>
          <div className="list-vehicles">

          </div>
        </form>
      </div>
    </>
  )
}

export default Rent