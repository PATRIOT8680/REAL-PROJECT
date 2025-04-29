import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import { useTranslation } from 'react-i18next' 
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
  const { t } = useTranslation('auth')

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
						<span className='text'>{t('recovery.title-text')}</span>
					</div>
					<span className="description">{t('recovery.description')}</span>
				</div>
				
				<div className="inputs-section">
					<div className="section">
						<span className="title">{t('recovery.inputs.email')}</span>
						<div className="input">
							<div className="icon"><img src={email_icon} /></div>
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  maxLength={40} placeholder={t('recovery.inputs.enter-data')} />
						</div>
					</div>
					<div className="section">
						<span className="title">{t('recovery.inputs.code')}</span>
						<div className="input" id='code-input'>
							<input id='code' value={code} onChange={handleChangeCode} type="text" placeholder={t('recovery.inputs.enter-data')} />
							<span className="send-code" onClick={handleSendCode}>{t('recovery.inputs.sendCode')}</span>
						</div>
					</div>
					<div className="section">
						<span className="title">{t('recovery.inputs.newPass')}</span>
						<div className="input">
							<div className="icon"><img src={password_icon} /></div>
							<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} maxLength={30} placeholder={t('recovery.inputs.enter-data')} />
						</div>
					</div>
				</div>

				<div className="btns-section">
					<button type="button" className="main-btn" onClick={handleChangePass}>{t('recovery.btns.main-btn')}</button>
					<div className="bottom-btns">
						<button onClick={() => setCurrentForm('login')} type="button" className="scnd-btn">{t('recovery.btns.login-btn')}</button>
						<button onClick={() => setCurrentForm('register')} type="button" className="scnd-btn">{t('recovery.btns.reg-btn')}</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Recovery