import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { rce } from "../../../modules/rce.ts";
import '../assets/styles/compiled-css/VerifyEmail.css'
import { CustomEventHandler } from "../../../../../shared/CustomEventBase.ts";

import svg_password from '../assets/img/password.svg'

interface IVerify {
  login: string,
  email: string,
  password: string
}

const VerifyEmail = ({ login, email, password } : IVerify) => {
  let ev: CustomEventHandler
  const { t } = useTranslation('auth')
  const [code, setCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false)

  ev = rce.register('server:verify:successSendCode', () => {
    setIsCodeSent(true)
  })

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
      <div className="verify-email">
        <form className="main-block">
          <div className="header">
            <span className="title">{t('verify-email.title-text')}</span>
            <span className="descr">{t('verify-email.descr-text')}</span>
          </div>
          <div className="input-code">
            <div className="icon"><img src={svg_password} /></div>
            <input 
              type="password"
              maxLength={8}
              placeholder={t('verify-email.input-placeholder')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
          </div>
          <div className="btns-verify">
            <button type="button" className="btn-verify" onClick={handleVerify}>{t('verify-email.btns.verify')}</button>
            <span className="send-code" onClick={handleSendCode}>{t('verify-email.btns.send-code')}</span>
          </div>
        </form>
        <span className="warning-spam">{t('verify-email.warning-spam')}</span>
      </div>
    </>
  )
}

export default VerifyEmail