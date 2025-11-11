import { useCallback } from "react"
import { ISectionHead } from "../../Face.tsx"

import Slider from "../../../../../components/Slider/Slider.tsx"
import useSmoothWheelScroll from "../../../../../hooks/useSmoothScroll.ts";

const NoseSect = ({ dataChar, handleChange, updateFaceFeature }: ISectionHead) => {
  const sectionRef = useSmoothWheelScroll()

  return (
      <section className="section-part" ref={sectionRef}>
        <Slider title='Ширина носа' value={dataChar.faceFeatures[0]}
            onChange={(value: number) => updateFaceFeature(0, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Узкий' subtitleTwo='Широкий'
        />

        <div className="line-separation"></div>
        <Slider title='Высота носа' value={dataChar.faceFeatures[1]}
            onChange={(value: number) => updateFaceFeature(1, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Вверх' subtitleTwo='Вниз'
        />

        <div className="line-separation"></div>
        <Slider title='Длина носа' value={dataChar.faceFeatures[2]}
            onChange={(value: number) => updateFaceFeature(2, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Больше' subtitleTwo='Меньше'
        />

        <div className="line-separation"></div>
        <Slider title='Кончик носа' value={dataChar.faceFeatures[4]}
            onChange={(value: number) => updateFaceFeature(4, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Вверх' subtitleTwo='Вниз'
        />

        <div className="line-separation"></div>
        <Slider title='Переносица' value={dataChar.faceFeatures[3]}
            onChange={(value: number) => updateFaceFeature(3, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Полая' subtitleTwo='Выраженная'
        />

        <div className="line-separation"></div>
        <Slider title='Смещение переносицы' value={dataChar.faceFeatures[5]}
            onChange={(value: number) => updateFaceFeature(5, value)}
            minVal={-1} maxVal={1}
            step={0.02} enterInput={false} random={true}
            subtitleOne='Направо' subtitleTwo='Налево'
        />
      </section>
  )
}

export default NoseSect