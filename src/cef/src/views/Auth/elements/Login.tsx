import { FC, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { hideAuth, showAuth } from "../../../actions/menus/auth"
import { IPropsAuth } from "../Index"
import { EventManager } from "../../../hooks/eventmanager.ts"
import { rpc } from "../../../main.tsx"
import '../assets/styles/compiled-css/Login.css'

import login_pers from '../assets/img/login-pers.png'
import bg_title from '../assets/img/login-title.svg'
import login_icon from '../assets/img/login.svg'
import password_icon from '../assets/img/password.svg'

const Login: FC<IPropsAuth> = ({ setCurrentForm }) => {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')

  useEffect(() => {
    const saveLoginHandler = (login: string) => {
			setLogin(login)
		}

    rpc.register('client:auth:saveLogin', saveLoginHandler)

    rpc.register('server:loginSuccess', () => {
      rpc.callClient('cef:authDisabled')
			setLogin('')
			setPassword('')
    })

    return () => {
      rpc.unregister('server:loginSuccess')
    }
  }, [])

  const handleAuth = () => {
    console.log('handleAuth вызван')

    if (!login || !password) {
      window.App.sendNotifyReducer.sendNotify('err', 'Поля ввода не могут быть пустыми!', 4000, 'right')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (login.includes('@') && !emailRegex.test(login)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Некорректный email', 4000, 'right')
      return
    }

    if (login.length < 4) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не менее 4 символов!', 5500, 'right')
			return
		}

		if (login.length > 25) {
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
      rpc.callServer('cef:auth:loginAccount', [login.toLocaleLowerCase(), password.toLocaleLowerCase()])
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
						<span className='text'>Авторизация</span>
					</div>
					<span className="description">Чтобы продолжить игру, введите свои данные от аккаунта</span>
				</div>

				<div className="inputs-section">
					<div className="section">
						<span className="title">Логин / Email</span>
						<div className="input">
							<div className="icon"><img src={login_icon} /></div>
							<input 
								type="text"
								maxLength={40}
								placeholder="Введите данные..."
								value={login}
								onChange={(e) => setLogin(e.target.value)}
							/>
						</div>
					</div>
					<div className="section">
						<span className="title">Пароль</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input 
								type="password"
								maxLength={30}
								placeholder="Введите данные..."
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="btns-section">
					<button type="button" className="main-btn" onClick={handleAuth}>Авторизоваться</button>
					<div className="bottom-btns">
						<button onClick={() => setCurrentForm('register')} type="button" className="scnd-btn">Зарегистрироваться</button>
						<button onClick={() => setCurrentForm('recovery')} type="button" className="scnd-btn">Восстановление</button>
					</div>
				</div>

				<span className="description-project">
					REDSTAR - это многофункциональный проект с режимом ролевой игры. Просим вас соблюдать правила сервера, чтобы не портить атмосферу и не получить наказание!
				</span>
			</div>
		</>
	)
}

export default Login