import { useState, memo, useCallback } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { rce } from "../../modules/rce.ts";
import Info from './components/Info.tsx'

export interface IDataChar {
  firstName: string,
  lastName: string,
  age: number | string
}

export interface IInputChange {
  fieldName: string,
  value: any
}

const CreateChar = memo(() => {
  const createCharState = useSelector((state: RootState) => state.createCharReducer)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [dataChar, setDataChar] = useState<IDataChar>({
    firstName: '',
    lastName: '',
    age: ''
  })

  const handleInputChange = useCallback((fieldName: string, value: any) => {
    setDataChar(prev => ({
      ...prev,
      [fieldName]: value
    }))

    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Валидация имени
    if (!dataChar.firstName) {
      newErrors.firstName = "Имя обязательно"
    } else if (!/^[A-Za-z]+$/.test(dataChar.firstName)) {
      newErrors.firstName = "Имя должно содержать только английские буквы"
    } else if (dataChar.firstName.length < 3) {
      newErrors.firstName = "Имя должно быть не менее 3 символов"
    } else if (dataChar.firstName[0] !== dataChar.firstName[0].toUpperCase()) {
      newErrors.firstName = "Первая буква должна быть заглавной"
    }

    // Валидация фамилии
    if (!dataChar.lastName) {
      newErrors.lastName = "Фамилия обязательна"
    } else if (!/^[A-Za-z]+$/.test(dataChar.lastName)) {
      newErrors.lastName = "Фамилия должна содержать только английские буквы"
    } else if (dataChar.lastName.length < 3) {
      newErrors.lastName = "Фамилия должна быть не менее 3 символов"
    } else if (dataChar.lastName[0] !== dataChar.lastName[0].toUpperCase()) {
      newErrors.lastName = "Первая буква должна быть заглавной"
    }

    // Валидация возраста
    if (!dataChar.age) {
      newErrors.age = "Возраст обязателен"
    } else {
      const ageNum = Number(dataChar.age)
      if (isNaN(ageNum)) {
        newErrors.age = "Возраст должен быть числом"
      } else if (ageNum < 18) {
        newErrors.age = "Возраст должен быть не менее 18 лет"
      } else if (ageNum > 90) {
        newErrors.age = "Возраст должен быть не более 90 лет"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateChar = () => {
    if (validateForm()) {
      rce.triggerServer('cef:handleCreateChar', createCharState.numberSlot, dataChar)
    }
  }

  const onMouseEnterInterface = () => {
    rce.triggerClient('pauseCameraRotator', true)
  }

  const onMouseLeaveInterface = () => {
    rce.triggerClient('pauseCameraRotator', false)
  }

  return (
    <>
      <div className="create-char" onMouseEnter={onMouseEnterInterface} onMouseLeave={onMouseLeaveInterface}>
        <Info onInputChange={handleInputChange} dataChar={dataChar} errors={errors} />
        <button type='button' onClick={handleCreateChar}>Создать</button>
      </div>
    </>
  )
})

export default CreateChar