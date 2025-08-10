import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { rpc } from "../../../main.tsx"
import '../assets/styles/compiled-css/Login.css'

import login_pers from '../assets/img/login-pers.png'
import bg_title from '../assets/img/login-title.svg'
import login_icon from '../assets/img/login.svg'
import password_icon from '../assets/img/password.svg'

interface IAuthLogin {
  setCurrentForm: (newForm: 'login' | 'register' | 'recovery' | 'verify-email') => void,
  saveLogin: string,
  setSaveLogin: (login: string) => void
}

const Login: FC<IAuthLogin> = ({ setCurrentForm, saveLogin, setSaveLogin }) => {
	const [password, setPassword] = useState('')
  const { t } = useTranslation('auth')

  useEffect(() => {
    const saveLoginHandler = (login: string) => {
			setSaveLogin(login)
		}

    rpc.register('client:auth:saveLogin', saveLoginHandler)

    rpc.register('server:loginSuccess', () => {
      rpc.callClient('cef:authDisabled')
			setSaveLogin('')
			setPassword('')
    })

    return () => {
      rpc.unregister('server:loginSuccess')
      rpc.unregister('client:auth:saveLogin')
    }
  }, [])

  const handleAuth = () => {
    console.log('handleAuth вызван')

    if (!saveLogin || !password) {
      window.App.sendNotifyReducer.sendNotify('err', 'Поля ввода не могут быть пустыми!', 4000, 'right')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (saveLogin.includes('@') && !emailRegex.test(saveLogin)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Некорректный email', 4000, 'right')
      return
    }

    if (saveLogin.length < 4) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не менее 4 символов!', 5500, 'right')
			return
		}

		if (saveLogin.length > 25) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не более 25 символов!', 5500, 'right')
			return
		}

    if (password.length < 6) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль должен сожержать не менее 6 символов!', 5000, 'right')
			return
		}

		if (password.length > 30) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль должен сожержать более 30 символов!', 5500, 'right')
			return
		}

    try {
      rpc.callServer('cef:auth:loginAccount', [saveLogin.toLocaleLowerCase(), password.toLocaleLowerCase()])
    } catch (e) {
      console.error(`[AUTH] Ошибка авторизации: ${e}`)
    }
  }

  return (
		<>
			<div className='login-form' id='content'>
				<img src={login_pers} className='pers-img' id='pers-img-l' />

				<div className='header-section'>
					<div className='title'>
						<img src={bg_title} className='bg' />
						<div className='lines'>
							<div className='line-1'></div>
							<div className='line-2'></div>
						</div>
						<span className='text'>{t('login.title-text')}</span>
					</div>
					<span className="description">{t('login.description')}</span>
				</div>

				<div className="inputs-section">
					<div className="section">
						<span className="title">{t('login.inputs.login')}</span>
						<div className="input">
							<div className="icon"><img src={login_icon} /></div>
							<input 
								type="text"
								maxLength={40}
								placeholder={t('login.inputs.enter-data')}
								value={saveLogin}
								onChange={(e) => setSaveLogin(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<span className="title">{t('login.inputs.password')}</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input 
								type="password"
								maxLength={30}
								placeholder={t('login.inputs.enter-data')}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="btns-section">
					<button type="button" className="main-btn" onClick={handleAuth}>{t('login.btns.main-btn')}</button>
					<div className="bottom-btns">
						<button onClick={() => setCurrentForm('register')} type="button" className="scnd-btn">{t('login.btns.reg-btn')}</button>
						<button onClick={() => setCurrentForm('recovery')} type="button" className="scnd-btn">{t('login.btns.recovery-btn')}</button>
					</div>
				</div>

				<span className="description-project">
					{t('login.descr-project')}
				</span>
			</div>
		</>
	)
}

export default Login