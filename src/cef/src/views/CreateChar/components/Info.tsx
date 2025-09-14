import './assets/styles/compiled-css/Info.css'
import { FC, ChangeEvent, memo, useCallback } from "react"
import { IDataChar, IInputChange } from "../Index.tsx";

interface IInfo {
  onInputChange: (fieldName: string, value: any) => void,
  dataChar: IDataChar,
  errors: { [key: string]: string }
}

const Info: FC<IInfo> = memo(({ onInputChange, dataChar, errors }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.name, e.target.value)
  }, [onInputChange])

  return (
    <>
      <div className="info-player">
        <input type="text"
          name="firstName"
          className="firstname"
          placeholder='Имя...'
          value={dataChar.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <input type="text"
          name="lastName"
          className="lastname"
          placeholder='Фамилия...'
          value={dataChar.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}

        <input type="text"
          name="age"
          className="age"
          placeholder='Возраст...'
          value={dataChar.age}
          onChange={handleChange}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>
    </>
  )
})

export default Info