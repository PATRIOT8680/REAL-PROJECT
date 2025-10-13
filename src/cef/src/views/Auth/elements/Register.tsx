import '../assets/styles/compiled-css/Register.css'
import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import { useTranslation } from 'react-i18next'
import { rce } from "../../../modules/rce.ts";

import Input from "../components/Input.tsx";
import MainBtn from "../components/MainBtn.tsx";

const Register: FC<IPropsAuth> = ({ setCurrentForm, setRegisterData }) => {
	const [login, setLogin] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
  const { t } = useTranslation('auth')

  const validateLogin = (login: string): boolean => {
    if (!login || login.length < 4) {
      return false;
    }

    return login.length >= 4 && login.length <= 25;
  }

  const validateEmail = (email: string): boolean => {
    if (!email || email.length < 4) {
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)

    return email.length >= 4 && email.length <= 25
  }

	const handleRegister = () => {
		if (login.length < 4) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не менее 4 символов!', 5000, 'right')
			return
		}

		if (login.length > 25) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не более 25 символов!', 5000, 'right')
			return
		}

		const latinRegex = /^[A-Za-z0-9]+$/
		if (!latinRegex.test(login)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать только латиницу!', 5000, 'right')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Неправильный формат Email!', 4000, 'right')
			return
		}

		if (password.length < 6) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль не должен сожержать не менее 6 символов!', 5000, 'right')
			return
		}

		if (password.length > 30) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль не должен сожержать более 30 символов!', 5000, 'right')
			return
		}

		if (password.toLocaleLowerCase() !== passwordConfirm.toLocaleLowerCase()) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароли не совпадают!', 4000, 'right')
			return
		}

		try {
      if (setRegisterData) {
        setRegisterData({
          login: login.toLowerCase(),
          email: email.toLowerCase(),
          password: password.toLowerCase()
        })
      }
      rce.triggerServer('cef:auth:regAccount', login.toLowerCase(), email.toLowerCase(), password.toLowerCase())
		} catch (e) {
      rce.triggerClient('clientCmd', `[AUTH] Ошибка регистрации: ${e}`)
		}
	}

	return (
		<>
			<div className='register-form' id='content'>
				<div className="inputs-block">
          <Input
            type='text' value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder='Логин'
            maxLength={40}
            isValid={validateLogin(login)}
          />
          <Input
            type='text' value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            maxLength={40}
            isValid={validateEmail(email)}
          />
          <Input
            type='password' value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Пароль'
            maxLength={40}
          />
          <Input
            type='password' value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder='Повторите пароль'
            maxLength={40}
          />
        </div>
        <div className="btns-block">
          <MainBtn
              text='Играть'
              onClick={handleRegister}
              nextIcon={true}
              textSize={1.3}
          />
          <span className="recovery-btn" onClick={() => setCurrentForm('recovery')}>Восстановить доступ</span>
        </div>
			</div>
		</>
	)
}

export default Register