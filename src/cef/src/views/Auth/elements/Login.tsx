import '../assets/styles/compiled-css/Login.css'

import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { rce } from "../../../modules/rce.ts";
import { CustomEventHandler } from "../../../../../shared/CustomEventBase.ts";

import Input from "../components/Input.tsx";
import MainBtn from "../components/MainBtn.tsx";

interface IAuthLogin {
  setCurrentForm: (newForm: 'login' | 'register' | 'recovery' | 'verify-email') => void,
  saveLogin: string,
  setSaveLogin: (login: string) => void
}

const Login: FC<IAuthLogin> = ({ setCurrentForm, saveLogin, setSaveLogin }) => {
	let ev: CustomEventHandler
	const [password, setPassword] = useState('')
  const { t } = useTranslation('auth')

  const validateLogin = (login: string): boolean => {
    if (!login || login.length < 4) {
      return false;
    }

    if (login.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(login);
    }

    return login.length >= 4 && login.length <= 25;
  }

  const handleAuth = () => {
    if (!saveLogin || !password) {
      window.App.sendNotifyReducer.sendNotify('err', 'Поля ввода не могут быть пустыми!', 4000, 'bottom')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (saveLogin.includes('@') && !emailRegex.test(saveLogin)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Некорректный email', 4000, 'bottom')
      return
    }

    if (saveLogin.length < 4) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не менее 4 символов!', 5500, 'bottom')
			return
		}

		if (saveLogin.length > 25) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не более 25 символов!', 5500, 'bottom')
			return
		}

    if (password.length < 6) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль должен сожержать не менее 6 символов!', 5000, 'bottom')
			return
		}

		if (password.length > 30) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль должен сожержать более 30 символов!', 5500, 'bottom')
			return
		}

    try {
      rce.triggerServer('cef:auth:loginAccount', saveLogin.toLocaleLowerCase(), password.toLocaleLowerCase())
    } catch (e) {
      console.error(`[AUTH] Ошибка авторизации: ${e}`)
    }
  }

  return (
		<>
			<div className='login-form' id='content'>
				<div className="inputs-block">
          <Input
              type='text' value={saveLogin}
              onChange={(e) => setSaveLogin(e.target.value)}
              placeholder='Логин / Email'
              maxLength={40}
              isValid={validateLogin(saveLogin)}
          />

          <Input
              type='password' value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Пароль'
              maxLength={40}
          />
        </div>
        <div className="btns-block">
          <MainBtn
            text='Вход'
            onClick={handleAuth}
            nextIcon={true}
            textSize={1.3}
          />
          <span className="recovery-btn" onClick={() => setCurrentForm('recovery')}>Восстановить доступ</span>
        </div>
			</div>
		</>
	)
}

export default Login