import './assets/styles/compiled-css/InputModal.css'
import { useState } from "react";

import Input from "../Input/Input.tsx";
import MainBtn from "../MainBtn/MainBtn.tsx";

interface Field {
  name: string,
  placeholder: string,
  type?: string,
  defaultValue?: string,
}

interface InputModalProps {
  title: string,
  fields: Field[],
  buttonText: string,
  onSubmit: (data: Record<string, string>) => void,
  onClose: () => void
}

const InputModal = ({
  title,
  fields,
  buttonText,
  onSubmit,
  onClose,
}: InputModalProps) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || ''
    })
    return initial
  })

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="input-modal-overlay" onClick={onClose}>
      <div className="input-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <span>{title}</span>
          <button className="close-menu" onClick={onClose}>X</button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="fields-container">
            {fields.map((field) => (
              <Input
                type={field.type || 'text'}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || 'Text'}
                maxLength={50}
              />
            ))}
          </div>
          <MainBtn
            text={buttonText}
            onClick={handleSubmit}
            nextIcon={false}
            textSize={.95}
          />
        </form>
      </div>
    </div>
  )
}

export default InputModal