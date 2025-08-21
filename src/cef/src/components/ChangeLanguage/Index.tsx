import './assets/styles/compiled-css/Index.css'

import { useState } from 'react'
import { rce } from "../../modules/rce.ts";
import { i18n } from '../../locales'

const ChangeLanguage = () => {
  const [language, setLanguage] = useState<string>(i18n.language)
  const [isListOpen, setIsListOpen] = useState<boolean | undefined>(undefined)

  const nameLanguages = {
    'ru': 'Русский',
    'en': 'English',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español'
  }

  const handleListOpen = () => {
    setIsListOpen(!isListOpen)

  }

  const availableLanguages = Object.keys(nameLanguages)
    .filter(lang => lang !== language)
    .map(lang => ({
      code: lang,
      name: nameLanguages[lang as keyof typeof nameLanguages]
    }))

  const changeLanguage = (language: string) => {
    setLanguage(language)
    rce.triggerClient('cef:changeLanguage', language)
    i18n.changeLanguage(language)
    setIsListOpen(false)
  }

  return (
    <>
      <div className="change-language">
        <button className={`current-lng ${isListOpen !== undefined && (isListOpen ? 'open' : 'closed')}`} type='button' onClick={handleListOpen}>
          <img className='flag' src={`./assets/img/change_language/${language}.svg`} />
          <span className="name">{nameLanguages[language as keyof typeof nameLanguages]}</span>
          <svg id={`icon-${isListOpen ? 'open' : 'closed'}`} width="13" height="8" viewBox="0 0 13 8" fill="none">
            <path d="M12 1L6.5 7L1 1" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        { isListOpen && (
          <div className="list-languages">
            { availableLanguages.map(({ code, name }) => (
              <button key={code} className="lang-option" type='button' onClick={() => changeLanguage(code)}>
                <img className='flag' src={`./assets/img/change_language/${code}.svg`} />
                <span className="name">{name}</span>
              </button>
            )) }
          </div>
        ) }
        
      </div>
    </>
  )
}

export default ChangeLanguage