import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import '../assets/styles/compiled-css/Recovery.css'
import { rpc } from '../../../main'

import recovery_pers from '../assets/img/recovery-pers.png'
import bg_title from '../assets/img/recovery-title.svg'
import password_icon from '../assets/img/password.svg'
import email_icon from '../assets/img/email.svg'

const Recovery: FC<IPropsAuth> = ({ setCurrentForm }) => {
  const [email, setEmail] = useState<string>('')
	const [code, setCode] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)

  useEffect(() => {
    rpc.register('server:successSendNotify', () => {
      setIsCodeSent(true)
    })

    rpc.register('server:auth:changePassSuccess', () => {
      setEmail('')
      setCode('')
      setNewPassword('')
    })

    return () => {
      rpc.unregister('server:successSendNotify')
      rpc.unregister('server:auth:changePassSuccess')
    }
  }, [])

	const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    const validCharacters = /^[A-Za-z0-9]*$/
    const filteredValue = inputValue.split('').filter(char => validCharacters.test(char)).join('')

    if (filteredValue.length <= 8) {
      setCode(filteredValue)
    }
  }

  const handleSendCode = () => {
    if (!email) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите Email от существующего аккаунта!', 5000, 'right')
      return
    }

    if (isCodeSent) {
      window.App.sendNotifyReducer.sendNotify('warning', 'Вы уже запросили код! Подождите 1 мин 30 сек. после отправки кода!', 7000, 'right')
      return
    }

    rpc.callServer('cef:auth:sendRecoveryCode', [email])

    setTimeout(() => {
      setIsCodeSent(false)
    }, 90000)
  }

  const handleChangePass = () => {
    if (!email || !code || !newPassword) {
      window.App.sendNotifyReducer.sendNotify('err', 'Заполните все поля!', 4000, 'right')
      return
    }

    rpc.callServer('cef:auth:changePassRecovery', [email.toLowerCase(), code, newPassword.toLowerCase()])
  }

	return (
		<>
			<div className='recovery-form' id='content'>
				<img src={recovery_pers} className='pers-img' id='pers-img-rec' />

				<div className='header-section'>
					<div className='title'>
						<img src={bg_title} className='bg' />
						<div className='lines'>
							<div className='line-1'></div>
							<div className='line-2'></div>
						</div>
						<span className='text'>Восстановление</span>
					</div>
					<span className="description">Забыли пароль от аккаунта? <br/>Вы можете попробовать его восстановить!</span>
				</div>
				
				<div className="inputs-section">
					<div className="section">
						<span className="title">Привязанный Email</span>
						<div className="input">
							<div className="icon"><img src={email_icon} /></div>
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  maxLength={40} placeholder="Введите данные..." />
						</div>
					</div>
					<div className="section">
						<span className="title">Код с почты</span>
						<div className="input" id='code-input'>
							<input id='code' value={code} onChange={handleChangeCode} type="text" placeholder="Введите данные..." />
							<span className="send-code" onClick={handleSendCode}>Отправить код</span>
						</div>
					</div>
					<div className="section">
						<span className="title">Новый пароль</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} maxLength={30} placeholder="Введите данные..." />
						</div>
					</div>
				</div>

				<div className="btns-section">
					<button type="button" className="main-btn" onClick={handleChangePass}>Поменять пароль</button>
					<div className="bottom-btns">
						<button onClick={() => setCurrentForm('login')} type="button" className="scnd-btn">Авторизоваться</button>
						<button onClick={() => setCurrentForm('register')} type="button" className="scnd-btn">Зарегистрироваться</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Recovery