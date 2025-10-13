import './assets/styles/compiled-css/Index.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { rce } from "../../modules/rce.ts";
import { CustomEventHandler } from "../../../../shared/CustomEventBase.ts";

import Login from './elements/Login'
import Register from './elements/Register'
import Recovery from './elements/Recovery'
import VerifyEmail from './elements/VerifyEmail'
import Header from './components/Header.tsx'

export interface IPropsAuth {
	setCurrentForm: (newForm: 'login' | 'register' | 'recovery' | 'verify-email') => void
  setRegisterData?: (data: { login: string; email: string; password: string }) => void
}

const Auth = () => {
  let ev: CustomEventHandler
	const dispatch = useDispatch()
  const [saveLogin, setSaveLogin] = useState<string>('')
	const [currentForm, setCurrentForm] = useState<'login' | 'register' | 'recovery' | 'verify-email'>('login')
  const [registerData, setRegisterData] = useState({
    login: '',
    email: '',
    password: ''
  })

  rce.register('client:auth:saveLogin', (login: string) => {
    setSaveLogin(login)
    console.log(login)
  })

  rce.register('server:auth:loggingAuth', (message: string) => {
    rce.triggerClient('clientCmd', `${message}`)
  })

  rce.register('server:auth:showVerify', () => {
    setCurrentForm('verify-email')
  })

  rce.register('server:authSuccess', () => {
    rce.triggerClient('cef:authDisabled')
  })


	return (
		<>
			<div className='auth'>
        <svg className='header-blur' width="587" height="249" viewBox="0 0 587 249" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse opacity="0.2" cx="293.5" cy="124.5" rx="293.5" ry="124.5" fill="#FFCA58"/>
        </svg>

        <div className="logo-pulse">
          <svg className='top-part' width="350" height="349" viewBox="0 0 350 349" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M174.854 0.378418C271.07 0.378665 349.069 78.3783 349.069 174.595C349.069 270.812 271.07 348.811 174.854 348.811C78.6366 348.811 0.636966 270.812 0.636719 174.595C0.636719 78.3782 78.6365 0.378418 174.854 0.378418ZM88.8389 197.111H174.854L165.296 271.329L260.867 160.002H174.854L184.41 85.7856L88.8389 197.111Z" fill="#2B272E" />
          </svg>
          <svg className='bottom-part' width="212" height="191" viewBox="0 0 212 191" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="106" cy="95.5" rx="106" ry="95.5" fill="#FFCA58" />
          </svg>
        </div>

        <svg className='bottom-blur' width="587" height="249" viewBox="0 0 587 249" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse opacity="0.2" cx="293.5" cy="124.5" rx="293.5" ry="124.5" fill="#FFCA58"/>
        </svg>


        { currentForm === 'verify-email' &&
            <VerifyEmail
              login={registerData.login}
              email={registerData.email}
              password={registerData.password}
              setCurrentForm={(val: 'login' | 'register' | 'recovery' | 'verify-email') => setCurrentForm(val)}
            /> }

				{currentForm !== 'verify-email' && (
          <form className={`form-block ${currentForm}`}>
            <Header currentForm={currentForm} setCurrentForm={(form: 'login' | 'register' | 'recovery' | 'verify-email') => setCurrentForm(form)} />
            {currentForm === 'login' && <Login setCurrentForm={setCurrentForm} saveLogin={saveLogin} setSaveLogin={setSaveLogin} />}
            {currentForm === 'register' && <Register setCurrentForm={setCurrentForm} setRegisterData={setRegisterData} />}
            {currentForm === 'recovery' && <Recovery setCurrentForm={setCurrentForm} />}
          </form>
        )}
			</div>
		</>
	)
}

export default Auth
