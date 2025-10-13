import './assets/styles/compiled-css/Header.css'
import { useState, FC } from "react";

import svg_logo from './assets/img/logo.svg'

export interface IHeader {
  currentForm: 'login' | 'register' | 'recovery' | 'verify-email',
  setCurrentForm: (newForm: 'login' | 'register' | 'recovery' | 'verify-email') => void,
}

interface IForm {
  key: 'login' | 'register' | 'recovery' | 'verify-email',
  name: string
}

const Header: FC<IHeader> = ({ currentForm, setCurrentForm }) => {
  const forms: IForm[] = [
    { key: 'login', name: 'Авторизация' },
    { key: 'register', name: 'Регистрация' }
  ]

  return (
      <header className="header-form">
        <img className='svg_logo' src={svg_logo} />
        <div className="text-line">
          { forms.map((form: IForm, key) => (
              <span
                  key={key}
                  className={`name-form ${form.key === currentForm ? 'active' : ''}`}
                  onClick={() => setCurrentForm(form.key)}
              >
              {form.name}
                { form.key === currentForm && ( <div className='line' /> ) }
            </span>
          )) }
        </div>
      </header>
  )
}

export default Header