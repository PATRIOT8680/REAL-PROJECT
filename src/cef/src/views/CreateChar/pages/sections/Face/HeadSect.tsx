import {useCallback} from "react"
import { ISectionHead } from "../../Face.tsx"

import Slider from "../../../../../components/Slider/Slider.tsx"
import useSmoothWheelScroll from "../../../../../hooks/useSmoothScroll.ts";

const HeadSect = ({ dataChar, updateFaceFeature }: ISectionHead) => {
  const sectionRef = useSmoothWheelScroll()
  return (
      <>
        <section className="section-part" ref={sectionRef}>
          <Slider title='Ширина скул' value={dataChar.faceFeatures[9]}
                  onChange={(value: number) => updateFaceFeature(9, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Узкие' subtitleTwo='Широкие'
          />

          <div className="line-separation"></div>
          <Slider title='Высота скул' value={dataChar.faceFeatures[8]}
                  onChange={(value: number) => updateFaceFeature(8, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Вверх' subtitleTwo='Вниз'
          />

          <div className="line-separation"></div>
          <Slider title='Ширина щёк' value={dataChar.faceFeatures[10]}
                  onChange={(value: number) => updateFaceFeature(10, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Широкие' subtitleTwo='Узкие'
          />

          <div className="line-separation"></div>
          <Slider title='Толщина губ' value={dataChar.faceFeatures[12]}
                  onChange={(value: number) => updateFaceFeature(12, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Толще' subtitleTwo='Тоньше'
          />

          <div className="line-separation"></div>
          <Slider title='Ширина челюсти' value={dataChar.faceFeatures[13]}
                  onChange={(value: number) => updateFaceFeature(13, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Узкая' subtitleTwo='Широкая'
          />

          <div className="line-separation"></div>
          <Slider title='Высота челюсти' value={dataChar.faceFeatures[14]}
                  onChange={(value: number) => updateFaceFeature(14, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Вверх' subtitleTwo='Вниз'
          />

          <div className="line-separation"></div>
          <Slider title='Длина подбородка' value={dataChar.faceFeatures[15]}
                  onChange={(value: number) => updateFaceFeature(15, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Короткий' subtitleTwo='Длинный'
          />

          <div className="line-separation"></div>
          <Slider title='Положение подбородка' value={dataChar.faceFeatures[16]}
                  onChange={(value: number) => updateFaceFeature(16, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Вовнутрь' subtitleTwo='Наружу'
          />

          <div className="line-separation"></div>
          <Slider title='Ширина подбородка' value={dataChar.faceFeatures[17]}
                  onChange={(value: number) => updateFaceFeature(17, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Узкий' subtitleTwo='Широкий'
          />

          <div className="line-separation"></div>
          <Slider title='Форма подбородка' value={dataChar.faceFeatures[18]}
                  onChange={(value: number) => updateFaceFeature(18, value)}
                  minVal={-1} maxVal={1}
                  step={0.02} enterInput={false} random={true}
                  subtitleOne='Простой' subtitleTwo='Двойной'
          />

          <div className="line-separation"></div>
          <Slider title='Ширина шеи' value={dataChar.faceFeatures[19]}
              onChange={(value: number) => updateFaceFeature(19, value)}
              minVal={-1} maxVal={1}
              step={0.02} enterInput={false} random={true}
              subtitleOne='Узкая' subtitleTwo='Широкая'
          />
        </section>
      </>
  )
}

export default HeadSect