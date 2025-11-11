import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { rce } from "../../../modules/rce.ts";
import '../assets/styles/compiled-css/VerifyEmail.css'
import { CustomEventHandler } from "../../../../../shared/CustomEventBase.ts";

import Input from "../../../components/Input/Input.tsx";
import MainBtn from "../../../components/MainBtn/MainBtn.tsx";

interface IVerify {
  login: string,
  email: string,
  password: string
  setCurrentForm: (val: 'login' | 'register' | 'recovery' | 'verify-email') => void
}

const VerifyEmail = ({ login, email, password, setCurrentForm } : IVerify) => {
  let ev: CustomEventHandler
  const { t } = useTranslation('auth')
  const [code, setCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)

  ev = rce.register('server:verify:successSendCode', () => {
    setIsCodeSent(true)
  })

  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    const validCharacters = /^[A-Za-z0-9]*$/
    const filteredValue = inputValue.split('').filter(char => validCharacters.test(char)).join('')

    if (filteredValue.length <= 8) {
      setCode(filteredValue)
    }
  }


  const handleSendCode = async () => {
    if (isCodeSent) {
      window.App.sendNotifyReducer.sendNotify('warning', 'Вы уже запросили код! Подождите 1 мин 30 сек. после отправки кода!', 7000, 'bottom')
      return
    }

    rce.triggerServer('cef:auth:sendCodeVerify', email)
    await setTimeout(() => {
      setIsCodeSent(false)
    }, 90000)
  }

  const handleVerify = () => {
    if (code.length > 8 || code.length < 8) {
      window.App.sendNotifyReducer.sendNotify('err', 'Код должен содержать 8 символов!', 7000, 'bottom')
      return
    }

    rce.triggerServer('cef:auth:verifyEmail', code, login, email, password)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsCodeSent(false)
    }, 90000)

    return () => {
      rce.clearRegister('server:verify:successSendCode')
    }
  }, [isCodeSent])


  return(
    <>
      <div className="form-block">
        <div className="verify-email" id='content'>
          <header>
            <span className="title">Подтверждение почты</span>
            <span className="descr">Пожалуйста, подтвердите электронную почту, на которую регистрируете аккаунт.</span>
          </header>
          <div className="inputs-block">
            <Input
                type='text' value={code}
                onChange={handleChangeCode}
                placeholder='Код подтверждения'
                maxLength={40}
            />
          </div>
          <div className="btns-block">
            <MainBtn
                text='Подтвердить'
                onClick={handleVerify}
                nextIcon={true}
                textSize={1.3}
            />

            <span className="recovery-btn" onClick={handleSendCode}>Отправить код ещё раз</span>
            <span className="recovery-btn" onClick={() => setCurrentForm('register')}>Вернуться</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyEmail