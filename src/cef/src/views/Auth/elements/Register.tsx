import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import { useTranslation } from 'react-i18next'
import '../assets/styles/compiled-css/Register.css'
import { rce } from "../../../modules/rce.ts";

import reg_pers from '../assets/img/reg-pers.png'
import bg_title from '../assets/img/reg-title.svg'
import login_icon from '../assets/img/login.svg'
import password_icon from '../assets/img/password.svg'
import email_icon from '../assets/img/email.svg'

const Register: FC<IPropsAuth> = ({ setCurrentForm, setRegisterData }) => {
	const [login, setLogin] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
  const { t } = useTranslation('auth')

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
				<img src={reg_pers} className='pers-img' id='pers-img-reg' />

				<div className='header-section'>
					<div className='title'>
						<img src={bg_title} className='bg' />
						<div className='lines'>
							<div className='line-1'></div>
							<div className='line-2'></div>
						</div>
						<span className='text'>{t('register.title-text')}</span>
					</div>
					<span className="description">{t('register.description')}</span>
				</div>

				<div className="inputs-section">
					<div className="section">
						<span className="title">{t('register.inputs.login')}</span>
						<div className="input">
							<div className="icon"><img src={login_icon} /></div>
							<input 
								type="text"
								maxLength={25}
								placeholder={t('register.inputs.enter-data')}
								value={login}
								onChange={(e) => setLogin(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<span className="title">{t('register.inputs.email')}</span>
						<div className="input">
							<div className="icon"><img src={email_icon} /></div>
							<input
								type="email"
								maxLength={40}
								placeholder={t('register.inputs.enter-data')}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<span className="title">{t('register.inputs.password')}</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input
								type="password"
								maxLength={30}
								placeholder={t('register.inputs.enter-data')}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<span className="title">{t('register.inputs.rep-pass')}</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input
								type="password"
								maxLength={30}
								placeholder={t('register.inputs.enter-data')}
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="btns-section">
					<button type="button" className="main-btn" onClick={handleRegister}>{t('register.btns.main-btn')}</button>
					<div className="bottom-btns">
						<button onClick={() => setCurrentForm('login')} type="button" className="scnd-btn">{t('register.btns.login-btn')}</button>
						<button onClick={() => setCurrentForm('recovery')} type="button" className="scnd-btn">{t('register.btns.recovery-btn')}</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Register