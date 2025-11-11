import './assets/styles/compiled-css/Clothes.css'
import { IDataChar } from "../Index.tsx";
import { useCallback, useEffect } from "react";
import { rce } from "../../../modules/rce.ts";

import { clothesChar } from "./assets/conf/clothes.ts";
import useSmoothWheelScroll from "../../../hooks/useSmoothScroll.ts";

interface IClothes {
  dataChar: IDataChar,
  handleChange: (fieldName: string, value: any) => void,
}

const Clothes = ({ dataChar, handleChange }: IClothes) => {
  const listImgRef = useSmoothWheelScroll()

  const getComponentId = (category: 'tops' | 'legs' | 'shoes'): number => {
    switch (category) {
      case 'tops': return 11
      case 'legs': return 4
      case 'shoes': return 6
      default: return 11
    }
  }

  const setClothingOnServer = useCallback((category: 'tops' | 'legs' | 'shoes', id: number) => {
    rce.triggerServer('setClothes', getComponentId(category), id, 0);
  }, []);

  const handleClothingChange = useCallback((category: 'tops' | 'legs' | 'shoes', id: number) => {
    console.log(`[CLIENT] Changing ${category} to ${id}, type: ${typeof id}`);

    const newClothes = {
      ...dataChar.clothes,
      [category]: id
    };
    handleChange('clothes', newClothes);

    const componentId = getComponentId(category);
    console.log(`[CLIENT] Sending to server: component=${componentId}, id=${id}`);

    rce.triggerServer('setClothes', componentId, id, 0);
    console.log(`[CLIENT] Changed ${category} to ${id}`);
  }, [dataChar.clothes, handleChange]);

  const renderClothingBlock = (category: 'tops' | 'legs' | 'shoes', title: string) => {
    if (!dataChar) {
      return <div className="loading">Загрузка...</div>;
    }

    const gender = dataChar.gender;

    return (
        <div className="select-img-block" key={`${gender}-${category}`}>
          <span className="title-img">{title}</span>
          <div className="list-imgs" ref={listImgRef}>
            {clothesChar[gender][category].map((id) => (
                <li
                    key={id}
                    className={`item-img ${id === dataChar.clothes[category] ? 'selected' : ''}`}
                    onClick={() => handleClothingChange(category, id)}
                >
                  <img
                      loading='lazy'
                      src={`assets/img/create-char/clothes/${gender}/${category}/${id}.jpg`}
                      onError={(e) => {
                        console.error(`Не удалось загрузить изображение: assets/img/create-char/clothes/${gender}/${category}/${id}.jpg`)
                        e.currentTarget.style.display = 'none'
                      }}
                      alt={`${title} ${id}`}
                      draggable="false"
                  />
                </li>
            ))}
          </div>
        </div>
    )
  }

  return (
      <div className="clothes-page">
        <section className="blocks-clothes">
          {renderClothingBlock('tops', 'Верхняя одежда')}
          {renderClothingBlock('legs', 'Штаны')}
          {renderClothingBlock('shoes', 'Обувь')}
        </section>
      </div>
  )
}

export default Clothes