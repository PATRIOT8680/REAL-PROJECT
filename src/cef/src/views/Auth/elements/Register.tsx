import '../assets/styles/compiled-css/Register.css'
import { FC, useState, useEffect } from 'react'
import { IPropsAuth } from '../Index'
import { useTranslation } from 'react-i18next'
import { rce } from "../../../modules/rce.ts";
import { useModal } from "../../../hooks/useModal.ts";

import Input from "../components/Input.tsx";
import MainBtn from "../components/MainBtn.tsx";

import svg_agree from '../assets/img/agree.svg'

const Register: FC<IPropsAuth> = ({ setCurrentForm, setRegisterData }) => {
	const [login, setLogin] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
  const [selectAgree, setSelectAgree] = useState<boolean>(false)

  const { t } = useTranslation('auth')
  const { openModal } = useModal()

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
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не менее 4 символов!', 5000, 'bottom')
			return
		}

		if (login.length > 25) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать не более 25 символов!', 5000, 'bottom')
			return
		}

		const latinRegex = /^[A-Za-z0-9]+$/
		if (!latinRegex.test(login)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Логин должен содержать только латиницу!', 5000, 'bottom')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Неправильный формат Email!', 4000, 'bottom')
			return
		}

		if (password.length < 6) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль не должен сожержать не менее 6 символов!', 5000, 'bottom')
			return
		}

		if (password.length > 30) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароль не должен сожержать более 30 символов!', 5000, 'bottom')
			return
		}

		if (password.toLocaleLowerCase() !== passwordConfirm.toLocaleLowerCase()) {
      window.App.sendNotifyReducer.sendNotify('err', 'Пароли не совпадают!', 4000, 'bottom')
			return
		}

    if (!selectAgree) {
      window.App.sendNotifyReducer.sendNotify('err', 'Вам нужно согласиться с пользовательским соглашением!', 4000, 'bottom')
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

  const handleOpenAgreement = () => {
    openModal(
        "Пользовательское соглашение",
        <div className="content">
          <p>Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между Администрацией проекта (далее — «Администрация») и Пользователем (далее — «Игрок») в рамках использования RP-сервера Grand Theft Auto V.</p>

          <p>1. Общие положения</p>
          <p>1.1. Начиная использовать сервер, Игрок считается принявшим условия Соглашения в полном объеме.</p>
          <p>1.2. Администрация оставляет за собой право вносить изменения в Соглашение без уведомления Игрока.</p>

          <p>2. Правила поведения</p>
          <p>2.1. Игрок обязуется соблюдать правила RP-сервера, включая отыгрыш роли, соответствие игровому процессу.</p>
          <p>2.2. Запрещено использование читов, эксплойтов и программ, дающих нечестное преимущество.</p>
          <p>2.3. Запрещено оскорбление игроков, администрации, распространение личной информации.</p>
          <p>2.4. Запрещены любые формы дискриминации, разжигание розни по расовым, национальным, религиозным признакам.</p>

          <p>3. Игровой процесс</p>
          <p>3.1. Игрок обязан соблюдать правила RolePlay: отыгрывать свою роль, избегать метагейминга.</p>
          <p>3.2. Запрещен DM (Death Match) - убийство без RP-причины.</p>
          <p>3.3. Запрещен DB (Drive-By) - наезд на игроков без RP-причины.</p>
          <p>3.4. Обязательное соблюдение правил New Life Rule (NLR) после смерти персонажа.</p>

          <p>4. Административные меры</p>
          <p>4.1. За нарушение правил Администрация вправе применить санкции: варн, мут, кик, временный или перманентный бан.</p>
          <p>4.2. Решение Администрации является окончательным и обсуждению не подлежит.</p>

          <p>5. Виртуальное имущество</p>
          <p>5.1. Все внутриигровые предметы, валюта, имущество являются виртуальными и не имеют реальной ценности.</p>
          <p>5.2. Администрация не несет ответственности за потерю виртуального имущества вследствие сбоев, багов.</p>

          <p>6. Конфиденциальность</p>
          <p>6.1. Администрация обязуется не передавать личные данные Игрока третьим лицам.</p>
          <p>6.2. Игрок дает согласие на обработку своих персональных данных для целей функционирования сервера.</p>

          <p>7. Заключительные положения</p>
          <p>7.1. Соглашение вступает в силу с момента регистрации на сервере.</p>
          <p>7.2. Игрок подтверждает, что достиг возраста 18 лет и обладает дееспособностью для принятия условий Соглашения.</p>
          <p>7.3. Все споры решаются путем переговоров, в случае невозможности - по усмотрению Администрации.</p>
        </div>
    )
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
        <div className="agree-rules">
          <div className={`icon ${selectAgree ? 'select' : ''}`} onClick={() => setSelectAgree(!selectAgree)}>
            { selectAgree && <img src={svg_agree} /> }
          </div>
          <span className="info">Согласен с <p onClick={handleOpenAgreement}>пользовательским соглашением</p></span>
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