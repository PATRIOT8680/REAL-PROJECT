import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import { useTranslation } from 'react-i18next' 
import '../assets/styles/compiled-css/Recovery.css'
import { rce } from "../../../modules/rce.ts";
import { CustomEventHandler } from "../../../../../shared/CustomEventBase.ts";

import Input from "../../../components/Input/Input.tsx";
import MainBtn from "../../../components/MainBtn/MainBtn.tsx";

const Recovery: FC<IPropsAuth> = ({ setCurrentForm }) => {
	let ev: CustomEventHandler
  const [email, setEmail] = useState<string>('')
	const [code, setCode] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)
  const { t } = useTranslation('auth')

	useEffect(() => {
		ev = rce.register('server:recovery:successSendNotify', () => {
			setIsCodeSent(true)
		})

		ev = rce.register('server:auth:changePassSuccess', () => {
			setEmail('')
			setCode('')
			setNewPassword('')
		})

		return () => {
			rce.clearRegister('server:recovery:successSendNotify')
			rce.clearRegister('server:auth:changePassSuccess')
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
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите Email от существующего аккаунта!', 5000, 'bottom')
      return
    }

    if (isCodeSent) {
      window.App.sendNotifyReducer.sendNotify('warning', 'Вы уже запросили код! Подождите 1 мин 30 сек. после отправки кода!', 7000, 'bottom')
      return
    }

    rce.triggerServer('cef:auth:sendRecoveryCode', email)

    setTimeout(() => {
      setIsCodeSent(false)
    }, 90000)
  }

  const handleChangePass = () => {
    if (!email || !code || !newPassword) {
      window.App.sendNotifyReducer.sendNotify('err', 'Заполните все поля!', 4000, 'bottom')
      return
    }

    rce.triggerServer('cef:auth:changePassRecovery', email.toLowerCase(), code, newPassword.toLowerCase())
  }

	return (
		<>
			<div className='recovery-form' id='content'>
        <div className="inputs-block">
          <Input
              type='text' value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Ваш Email'
              maxLength={40}
              isSendCode={true}
              btnClick={handleSendCode}
          />

          <Input
              type='text' value={code}
              onChange={handleChangeCode}
              placeholder='Код подтверждения'
              maxLength={40}
          />

          <Input
              type='password' value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Новый пароль'
              maxLength={40}
          />
        </div>
        <div className="btns-block">
          <MainBtn
              text='Восстановить'
              onClick={handleChangePass}
              nextIcon={false}
              textSize={1.3}
          />
          <span className="recovery-btn" onClick={() => setCurrentForm('login')}>Вернуться</span>
        </div>
			</div>
		</>
	)
}

export default Recovery