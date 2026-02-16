import './assets/styles/compiled-css/Input.css'
import { ChangeEvent, FC, useState } from "react";

import svg_ok from './assets/img/ok_input.svg'
import svg_send from './assets/img/send_code.svg'

interface IInput {
  type: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  maxLength: number,
  isValid?: boolean
  isSendCode?: boolean
  btnClick?: () => void
}

const Input: FC<IInput> = ({ type, value, onChange, placeholder, maxLength, isValid, isSendCode, btnClick }) => {
  const [showPassword, setShowPassword] = useState(false)

  const actualTypeInp = type === 'password' ? ( showPassword ? 'text' : 'password' ) : 'text'

  return (
      <div className="form-inp">
        <svg className='svg_icon' width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7607 0.0302779C12.4235 0.0322072 12.959 0.571643 12.957 1.23438L12.9541 2.17969L12.9551 2.18067L12.9512 13.7705C12.951 14.4511 12.3993 15.003 11.7188 15.0029C11.0382 15.0027 10.4864 14.451 10.4863 13.7705L10.4893 4.85743L2.70215 14.4111C2.26829 14.9434 1.48549 15.0235 0.95313 14.5898C0.420772 14.1559 0.34048 13.3722 0.774419 12.8398L9.20801 2.49219L1.23145 2.46973C0.549408 2.46774 -0.00195191 1.91349 5.19408e-06 1.23145C0.00199284 0.549492 0.556367 -0.00181465 1.23829 4.48899e-06L11.7607 0.0302779Z" fill="white" fill-opacity="0.4"/>
        </svg>
        <input
            type={actualTypeInp}
            name='text'
            autoComplete='off'
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            required
        />
        <label htmlFor='text' className='label-inp'>
          <span className="content-name">{placeholder}</span>
        </label>

        { (isSendCode && value ) && <img onClick={btnClick} className='send-code' src={svg_send} /> }

        { (type === 'password' && value !== '') && (
            showPassword ? (
              <svg width="35" height="23" viewBox="0 0 31 30" className='svg_visible-pass' onClick={() => setShowPassword(false)}>
                <path d="M3.98601 14.704C5.35345 8.154 11.0698 3.5 17.5 3.5C23.9302 3.5 29.6445 8.154 31.014 14.704C31.0682 14.9639 31.2238 15.1917 31.4464 15.3372C31.669 15.4827 31.9404 15.5341 32.201 15.48C32.4615 15.4259 32.6899 15.2708 32.8358 15.0487C32.9817 14.8267 33.0332 14.5559 32.9789 14.296C31.421 6.846 24.9046 1.5 17.5 1.5C10.0954 1.5 3.57898 6.846 2.02106 14.296C1.96682 14.5559 2.01831 14.8267 2.16421 15.0487C2.31011 15.2708 2.53845 15.4259 2.79902 15.48C3.05959 15.5341 3.33103 15.4827 3.55363 15.3372C3.77624 15.1917 3.93177 14.9639 3.98601 14.704ZM17.4799 7.5C19.3411 7.5 21.1261 8.2375 22.4422 9.55025C23.7582 10.863 24.4976 12.6435 24.4976 14.5C24.4976 16.3565 23.7582 18.137 22.4422 19.4497C21.1261 20.7625 19.3411 21.5 17.4799 21.5C15.6188 21.5 13.8338 20.7625 12.5177 19.4497C11.2017 18.137 10.4623 16.3565 10.4623 14.5C10.4623 12.6435 11.2017 10.863 12.5177 9.55025C13.8338 8.2375 15.6188 7.5 17.4799 7.5Z" fill="white"/>
                <path d="M0.233497 0.696349C0.677441 -0.0028168 1.60451 -0.210148 2.30381 0.233458L33.8038 20.2335C34.5031 20.6774 34.7104 21.6044 34.2667 22.3038C33.8227 23.003 32.8957 23.2104 32.1964 22.7667L0.696388 2.76666C-0.00272727 2.32265 -0.210225 1.39562 0.233497 0.696349Z" fill="#E0E0E0"/>
              </svg>
            ) : (
              <svg width="31" height="20" viewBox="0 0 35 23" className='svg_visible-pass' onClick={() => setShowPassword(true)}>
                <path d="M1.98601 13.204C3.35345 6.654 9.06983 2 15.5 2C21.9302 2 27.6445 6.654 29.014 13.204C29.0682 13.4639 29.2238 13.6917 29.4464 13.8372C29.669 13.9827 29.9404 14.0341 30.201 13.98C30.4615 13.9259 30.6899 13.7708 30.8358 13.5487C30.9817 13.3267 31.0332 13.0559 30.9789 12.796C29.421 5.346 22.9046 0 15.5 0C8.09538 0 1.57898 5.346 0.0210644 12.796C-0.0331762 13.0559 0.0183148 13.3267 0.16421 13.5487C0.310105 13.7708 0.538454 13.9259 0.799021 13.98C1.05959 14.0341 1.33103 13.9827 1.55363 13.8372C1.77624 13.6917 1.93177 13.4639 1.98601 13.204ZM15.4799 6C17.3411 6 19.1261 6.7375 20.4422 8.05025C21.7582 9.36301 22.4976 11.1435 22.4976 13C22.4976 14.8565 21.7582 16.637 20.4422 17.9497C19.1261 19.2625 17.3411 20 15.4799 20C13.6188 20 11.8338 19.2625 10.5177 17.9497C9.20166 16.637 8.4623 14.8565 8.4623 13C8.4623 11.1435 9.20166 9.36301 10.5177 8.05025C11.8338 6.7375 13.6188 6 15.4799 6Z" fill="white"/>
              </svg>
            )
        )}

        { isValid && <img className='svg_ok' src={svg_ok} /> }
      </div>
  )
}

export default Input