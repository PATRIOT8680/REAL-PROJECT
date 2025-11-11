import { ISectionHead } from "../../Face.tsx";
import { useCallback, useState } from "react";

import Slider from "../../../../../components/Slider/Slider.tsx";

const EyesSect = ({ dataChar, handleChange, updateFaceFeature }: ISectionHead) => {
  const eyesColor = [
    { id: 0, hex: '#008000' }, { id: 1, hex: '#50c878' },
    { id: 2, hex: '#42aaff' }, { id: 3, hex: '#1f75fe' },
    { id: 4, hex: '#322d28' }, { id: 5, hex: '#654321' },
    { id: 6, hex: '#8b4513' }, { id: 7, hex: '#49423d' },
    { id: 8, hex: '#bbbbbb' }, { id: 9, hex: '#ff1493' },
    { id: 10, hex: '#ffff00' }, { id: 11, hex: '#8b00ff' },
  ]

  return (
      <section className="section-part">
        <div className="block-color">
          <span className="header-color">Цвет глаз</span>
          <ul className="list-colors">
            { eyesColor.map((color, idx) => (
                <li
                    className={`item-color ${color.id === dataChar.eyeColor ? 'selected' : ''}`}
                    style={{ background: color.hex }}
                    onClick={() => handleChange('eyeColor', color.id)}
                    key={idx}
                ></li>
            )) }
          </ul>
        </div>

        <div className="line-separation"></div>

        <Slider title='Глаза' value={dataChar.faceFeatures[11]}
            onChange={(value: number) => updateFaceFeature(11, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Открытые' subtitleTwo='Закрытые'
        />
      </section>
  )
}

export default EyesSect