import './assets/styles/compiled-css/Info.css'
import { FC, ChangeEvent, memo, useCallback, useState } from "react"
import { IDataChar, IInputChange } from "../Index.tsx";
import { rce } from "../../../modules/rce.ts";

import Input from "../../../components/Input/Input.tsx";
import Slider from "../../../components/Slider/Slider.tsx";

interface IInfo {
  dataChar: IDataChar,
  handleChange: (fieldName: string, value: any) => void,
  errors: { [key: string]: string },
}

const Info: FC<IInfo> = memo(({ dataChar, handleChange, errors }) => {
  return (
    <>
      <div className="info-player">
        <div className="gender-block">
          <button
              className={`gender ${dataChar.gender === 'male' ? 'selected' : '' }`}
              onClick={() => handleChange('gender', 'male')}
          >
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 11.6667C12.3833 11.6667 15 14.2833 15 17.5C15 20.7167 12.3833 23.3333 9.16667 23.3333C5.95 23.3333 3.33333 20.7167 3.33333 17.5C3.33333 14.2833 5.95 11.6667 9.16667 11.6667ZM9.16667 8.33333C4.1 8.33333 0 12.4333 0 17.5C0 22.5667 4.1 26.6667 9.16667 26.6667C14.2333 26.6667 18.3333 22.5667 18.3333 17.5C18.3333 15.5667 17.7333 13.7833 16.7167 12.3L23.3333 5.7V10H26.6667V0H16.6667V3.33333H20.9667L14.35 9.95C12.8833 8.93333 11.1 8.33333 9.16667 8.33333Z" fill="white" fill-opacity="0.53" />
            </svg>
            <span className="text">Мужчина</span>
          </button>
          <button
              className={`gender ${dataChar.gender === 'female' ? 'selected' : '' }`}
              onClick={() => handleChange('gender', 'female')}
          >
            <svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3333 9.16667C18.3333 4.1 14.2333 0 9.16667 0C4.1 0 0 4.1 0 9.16667C0 13.6667 3.23333 17.3833 7.5 18.1667V21.6667H4.16667V25H7.5V28.3333H10.8333V25H14.1667V21.6667H10.8333V18.1667C15.1 17.3833 18.3333 13.6667 18.3333 9.16667ZM3.33333 9.16667C3.33333 5.95 5.95 3.33333 9.16667 3.33333C12.3833 3.33333 15 5.95 15 9.16667C15 12.3833 12.3833 15 9.16667 15C5.95 15 3.33333 12.3833 3.33333 9.16667Z" fill="white" fill-opacity="0.53" />
            </svg>
            <span className="text">Женщина</span>
          </button>
        </div>

        <Input
            type='text'
            value={dataChar.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder='Имя'
            maxLength={12}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <Input
            type='text'
            value={dataChar.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder='Фамилия'
            maxLength={12}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}

        {/*<Input*/}
        {/*    type='text'*/}
        {/*    value={(dataChar.age).toString()}*/}
        {/*    onChange={(e) => handleChange('age', e.target.value)}*/}
        {/*    placeholder='Возраст'*/}
        {/*    maxLength={12}*/}
        {/*/>*/}
        {/*{errors.age && <span className="error">{errors.age}</span>}*/}

        <Slider
            title='Возраст'
            value={Number(dataChar.age)}
            onChange={(value) => handleChange('age', value)} // Измените эту строку
            minVal={18}
            maxVal={90}
            step={1}
            enterInput={true}
            random={false}
        />
      </div>
    </>
  )
})

export default Info