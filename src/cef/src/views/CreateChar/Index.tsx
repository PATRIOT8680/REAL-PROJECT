import './assets/styles/compiled-css/Index.css'
import {useState, memo, Dispatch, SetStateAction, useCallback, useEffect} from 'react'
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { rce } from "../../modules/rce.ts";
import { fatherList, motherList } from "./pages/assets/conf/parents.ts";
import { clothesChar } from "./pages/assets/conf/clothes.ts";

import Info from './pages/Info.tsx'
import SelectPage from "./components/SelectPage.tsx";
import CurrentSection from "./CurrentSection.tsx";
import UniqueScenarios from "./components/UniqueScenarios.tsx";

export interface IDataChar {
  firstName: string,
  lastName: string,
  age: string,
  gender: 'male' | 'female',
  father: number,
  mother: number,
  shapeMix: number,
  skinMix: number,
  eyeColor: number,
  eyebrow: number,
  eyebrowColor: number,
  hair: number,
  hairColor: number,
  beard: number,
  beardColor: number,
  faceFeatures: number[],
  clothes: {
    tops: number
    legs: number
    shoes: number
  }
}

export interface IInputChange {
  fieldName: string,
  value: any
}

const CreateChar = memo(() => {
  const createCharState = useSelector((state: RootState) => state.createCharReducer)
  const [currentPage, setCurrentPage] = useState<string>('info')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [selectedScenarios, setSelectedScnearios] = useState<string | undefined>(undefined)
  const [previousDataChar, setPreviousDataChar] = useState<IDataChar | null>(null);
  const [charHistory, setCharHistory] = useState<IDataChar[]>(() => {
    const initialData: IDataChar = {
      firstName: '',
      lastName: '',
      age: '',
      gender: 'male',
      father: 0,
      mother: 21,
      shapeMix: 0.5,
      skinMix: 0.5,
      eyeColor: 0,
      eyebrow: 1,
      eyebrowColor: 62,
      hair: 0,
      hairColor: 0,
      beard: 0,
      beardColor: 62,
      faceFeatures: [
        0, 0, 0, 0, 0, 0, // Nose
        0, 0, // Brow
        0, 0, // Cheekbone
        0, 0, 0, // Cheeks, Eyes, Lips
        0, 0, // Jaw
        0, 0, 0, 0, // Chin
        0 // Neck
      ],
      clothes: {
        tops: 22,
        legs: 1,
        shoes: 1
      }
    };

    return [initialData, initialData, initialData];
  });

  const dataChar = charHistory[charHistory.length - 1];

  const updateCharHistory = useCallback((newDataChar: IDataChar) => {
    setCharHistory(prev => {
      const newHistory = [...prev]

      if (newHistory.length >= 3) {
        newHistory.shift()
      }

      newHistory.push(newDataChar)
      return newHistory
    })
  }, [])

  const syncDataToClient = useCallback((charData: IDataChar) => {
    Object.keys(charData).forEach(key => {
      if (key !== 'clothes' && key !== 'faceFeatures') {
        rce.triggerClient('cef:createChar:handleChange', key, (charData as any)[key])
      }
    })

    charData.faceFeatures.forEach((value, index) => {
      rce.triggerClient('cef:createChar:updateFaceFeature', index, value)
    })
  }, [])

  useEffect(() => {
    console.log('[EFFECT] dataChar changed, syncing to client');
    syncDataToClient(dataChar);
  }, [dataChar, syncDataToClient]);

  const randomizeCharacterData = useCallback((currentGender: 'male' | 'female') => {
    console.log('[RANDOM] Starting character randomization (without clothes)');

    const fatherIds = Object.keys(fatherList).map(Number);
    const motherIds = Object.keys(motherList).map(Number);

    const randomFatherId = fatherIds[Math.floor(Math.random() * fatherIds.length)]
    const randomMotherId = motherIds[Math.floor(Math.random() * motherIds.length)]

    const faceFeatures = Array(20)
        .fill(0)
        .map(() => Number(Math.random().toFixed(2)));

    const updatedData = {
      ...dataChar,
      father: randomFatherId,
      mother: randomMotherId,
      shapeMix: Number(Math.random().toFixed(2)),
      skinMix: Number(Math.random().toFixed(2)),
      eyeColor: Math.floor(Math.random() * 32),
      eyebrow: Math.floor(Math.random() * 34),
      eyebrowColor: Math.floor(Math.random() * 64),
      hair: Math.floor(Math.random() * 74),
      hairColor: Math.floor(Math.random() * 64),
      faceFeatures,
      clothes: dataChar.clothes
    };

    if (currentGender === 'male') {
      updatedData.beard = Math.floor(Math.random() * 29)
      updatedData.beardColor = Math.floor(Math.random() * 64)
    } else {
      updatedData.beard = 0
      updatedData.beardColor = 0
    }

    updateCharHistory(updatedData)
  }, [dataChar, updateCharHistory])

  const handleCancel = useCallback(() => {
    setCharHistory(prev => {
      if (prev.length > 1) {
        const newHistory = [...prev]
        newHistory.pop()
        return newHistory
      }
      return prev
    })
  }, [])

  const validateForm = () => {
    let isValid = true;

    if (!dataChar.firstName) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите имя персонажа!', 3000, 'bottom');
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(dataChar.firstName)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Имя должно содержать только английские буквы!', 3000, 'bottom');
      isValid = false;
    } else if (dataChar.firstName.length < 3) {
      window.App.sendNotifyReducer.sendNotify('err', 'Имя должно быть не менее 3 символов', 3000, 'bottom');
      isValid = false;
    } else if (dataChar.firstName[0] !== dataChar.firstName[0].toUpperCase()) {
      window.App.sendNotifyReducer.sendNotify('err', 'Первая буква имени должна быть заглавной', 3000, 'bottom');
      isValid = false;
    }

    if (!dataChar.lastName) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите фамилию персонажа!', 3000, 'bottom');
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(dataChar.lastName)) {
      window.App.sendNotifyReducer.sendNotify('err', 'Фамилия должна содержать только английские буквы', 3000, 'bottom');
      isValid = false;
    } else if (dataChar.lastName.length < 3) {
      window.App.sendNotifyReducer.sendNotify('err', 'Фамилия должна состоять не менее, чем из 3х букв', 3000, 'bottom');
      isValid = false;
    } else if (dataChar.lastName[0] !== dataChar.lastName[0].toUpperCase()) {
      window.App.sendNotifyReducer.sendNotify('err', 'Первая буква фамилии должна быть заглавной', 3000, 'bottom');
      isValid = false;
    }

    if (!dataChar.age) {
      window.App.sendNotifyReducer.sendNotify('err', 'Укажите возраст персонажа!', 3000, 'bottom');
      isValid = false;
    } else {
      const ageNum = Number(dataChar.age)
      if (isNaN(ageNum)) {
        window.App.sendNotifyReducer.sendNotify('err', 'Возраст должен быть в виде числа!', 3000, 'bottom');
        isValid = false;
      } else if (ageNum < 18) {
        window.App.sendNotifyReducer.sendNotify('err', 'Возраст должен быть не менее 18 лет!', 3000, 'bottom');
        isValid = false;
      } else if (ageNum > 90) {
        window.App.sendNotifyReducer.sendNotify('err', 'Возраст должен быть не более 90 лет!', 3000, 'bottom');
        isValid = false;
      }
    }

    return isValid;
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

  const setDefaultClothes = useCallback((gender: 'male' | 'female') => {
    const defaultTops = clothesChar[gender === 'male' ? 'm' : 'f'].tops[0];
    const defaultLegs = clothesChar[gender === 'male' ? 'm' : 'f'].legs[0];
    const defaultShoes = clothesChar[gender === 'male' ? 'm' : 'f'].shoes[0];

    rce.triggerServer('setClothes', 5, defaultTops, 0)
    rce.triggerServer('setClothes', 11, defaultLegs, 0)
    rce.triggerServer('setClothes', 12, defaultShoes, 0)

    return {
      tops: defaultTops,
      legs: defaultLegs,
      shoes: defaultShoes
    };
  }, []);

  const handleChange = useCallback((fieldName: string, value: any) => {
    console.log(`[CHANGE] Field: ${fieldName}, Value:`, value);

    const newData = {
      ...dataChar,
      [fieldName]: value
    };

    if (fieldName === 'gender') {
      const gender = value === 'male' ? 'm' : 'f';
      const defaultClothes = {
        tops: clothesChar[gender].tops[0],
        legs: clothesChar[gender].legs[0],
        shoes: clothesChar[gender].shoes[0]
      };
      newData.clothes = defaultClothes
      setDefaultClothes(value)
    }

    // Обновляем историю
    updateCharHistory(newData);

    // Отправляем изменения на клиент (кроме clothes, которые обрабатываются в syncDataToClient)
    if (fieldName !== 'clothes') {
      rce.triggerClient('cef:createChar:handleChange', fieldName, value);
    }
  }, [dataChar, updateCharHistory]);


  const initializeCharacter = useCallback(() => {
    Object.keys(dataChar).forEach(key => {
      if (key === 'faceFeatures') {
        dataChar.faceFeatures.forEach((value, index) => {
          rce.triggerClient('cef:createChar:updateFaceFeature', index, value);
        });
      } else {
        rce.triggerClient('cef:createChar:handleChange', key, (dataChar as any)[key])
      }
    });
  }, [dataChar])

  useEffect(() => {
    setTimeout(() => {
      initializeCharacter()
    }, 100)
  }, [initializeCharacter])

  useEffect(() => {
    setDefaultClothes(dataChar.gender)
  }, [])

  return (
    <>
      <div className="create-char">
        <div className="left-container" onMouseEnter={onMouseEnterInterface} onMouseLeave={onMouseLeaveInterface}>
          <header className="header-create-char">
            <span className="title">Создание персонажа</span>
            <span className="subtitle">Подойдите к созданию персонажа со всей ответственностью, изменить его можно будет в дальнейшем только в магазине</span>
          </header>
          <div className="block-content">
            <SelectPage
                handleRandom={() => randomizeCharacterData(dataChar.gender)}
                currentPage={currentPage}
                setCurrentPage={(page: string) => setCurrentPage(page)}
                handleCancel={handleCancel}
                canCancel={charHistory.length > 1}
            />
            <div className="line-split"></div>
            <CurrentSection currentPage={currentPage} dataChar={dataChar} handleChange={handleChange} errors={errors} />
            <div className="line-split"></div>
          </div>
        </div>
        <div className="right-content">
          <UniqueScenarios selectedScenarios={selectedScenarios} setSelectedScenario={(selected: string | undefined) => setSelectedScnearios(selected)} />
          <button className="saved-char" onClick={handleCreateChar}>Сохранить</button>
        </div>
      </div>
    </>
  )
})

export default CreateChar