import './assets/styles/compiled-css/Index.css'
import { useState, useEffect, useRef } from "react";
import {list} from "postcss";

interface ISelect {
  selected: string,
  onChange: (value: string) => void,
  options: {
    key: string,
    name: string
  }[],
  label?: string
}

const Select = ({ selected, onChange, options, label }: ISelect) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find(opt => opt.key === selected)

  const handleSelect = (key: string) => {
    onChange(key)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="select-component">
      { label && <span className="select-label">{label}</span> }
      <div className="custom-s-wrapper"
         onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-value">
          {selectedOption ? selectedOption.name : 'Выберите тип бизнеса'}
        </span>
        <svg className={`arrow-list ${isOpen ? 'opened' : ''}`} width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0002 16.0003C22.1048 16.0003 23.0002 16.8957 23.0002 18.0003C22.9999 19.1047 22.1046 20.0003 21.0002 20.0003H2.00019C0.895788 20.0003 0.00045836 19.1047 0.00019452 18.0003C0.00019452 16.8957 0.895625 16.0003 2.00019 16.0003H21.0002Z" fill="white"/>
          <path d="M19.5783 0.593089C20.3553 -0.191957 21.6223 -0.198481 22.4074 0.57844C23.1922 1.35542 23.1989 2.62252 22.4221 3.40754L12.9221 13.0072C12.5464 13.3866 12.0341 13.5999 11.5002 13.5999C10.9662 13.5999 10.454 13.3866 10.0783 13.0072L0.578319 3.40754C-0.198522 2.62252 -0.191835 1.35542 0.592968 0.57844C1.37807 -0.198481 2.64511 -0.191957 3.42207 0.593089L11.5002 8.75618L19.5783 0.593089Z" fill="white"/>
        </svg>

        { isOpen && (
          <div className="custom-options-list">
            {options.map((option) => (
              <span
                key={option.key}
                className={`custom-option ${selected === option.key ? 'selected' : ''}`}
                onClick={() => handleSelect(option.key)}
              >
              {option.name}
            </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select