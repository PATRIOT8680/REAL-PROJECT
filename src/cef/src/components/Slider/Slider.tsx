import './assets/styles/compiled-css/Index.css'
import svg_arrow from './assets/img/arrow.svg'

import { CSSProperties, useState, useEffect } from "react";

interface ISlider {
  title: string,
  value: number,
  onChange: (value: number) => void,
  minVal: number,
  maxVal: number,
  step: number,
  enterInput: boolean,
  random: boolean,
  subtitleOne?: string,
  subtitleTwo?: string,
}

const Slider = ({
  title,
  value,
  onChange,
  minVal,
  maxVal,
  step,
  enterInput,
  random,
  subtitleOne,
  subtitleTwo,
}: ISlider) => {
  const [inputValue, setInputValue] = useState<string>(
      (value >= minVal && value <= maxVal) ? value.toString() : minVal.toString()
  );

  useEffect(() => {
    if (value >= minVal && value <= maxVal) {
      setInputValue(value.toString());
    } else {
      setInputValue(minVal.toString());
      onChange(minVal);
    }
  }, [value, minVal, maxVal, onChange]);

  const normalizedValue = ((value - minVal) / (maxVal - minVal)) * 100
  const percentageOne = normalizedValue
  const percentageTwo = 100 - normalizedValue
  const fillPercent = ((value - minVal) / (maxVal - minVal)) * 100;

  const formatPercentage = (num: number) => {
    if (Number.isInteger(num)) {
      return `${num}%`
    } else {
      return `${num.toFixed(0)}%`
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!/^\d*$/.test(newValue)) {
      return
    }

    setInputValue(newValue);

    if (newValue !== '' && /^\d+$/.test(newValue)) {
      const numValue = parseInt(newValue, 10);

      if (numValue >= minVal && numValue <= maxVal) {
        onChange(numValue);
      }
    }
  }

  const handleInputBlur = () => {
    let numValue = parseInt(inputValue, 10);

    if (isNaN(numValue) || numValue < minVal) {
      numValue = minVal;
    } else if (numValue > maxVal) {
      numValue = maxVal;
    }

    setInputValue(numValue.toString());
    onChange(numValue);
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  }

  const handleRandomClick = () => {
    const stepCount = Math.floor((maxVal - minVal) / step);
    const randomStep = Math.floor(Math.random() * (stepCount + 1))
    const randomValue = minVal + randomStep * step

    onChange(randomValue)
    setInputValue(randomValue.toString())
  }

  return (
      <div className="main-slider">
        <header className="header-slider">
          <span className="title">{title}</span>
          { random && (
              <svg onClick={handleRandomClick} className='random-btn' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.95611 5.45722L1.48833 0L0 1.48833L5.45722 6.94555L6.95611 5.45722ZM11.0833 0L13.2367 2.15333L0 15.4006L1.48833 16.8889L14.7356 3.65222L16.8889 5.80556V0H11.0833ZM11.4317 9.93278L9.94333 11.4211L13.2472 14.725L11.0833 16.8889H16.8889V11.0833L14.7356 13.2367L11.4317 9.93278Z" fill="#888888" />
              </svg>
          ) }
        </header>
        <div className="container-slider">
          <div className="range-container">
            <img className='arrow' src={svg_arrow} />
            <input
                type='range'
                className="inp-slider"
                value={value >= minVal && value <= maxVal ? value : minVal}
                onChange={handleSliderChange}
                style={{ '--fill-percent': `${fillPercent}%` } as CSSProperties}
                min={minVal}
                max={maxVal}
                step={step}
            />
            <img className='arrow right' src={svg_arrow} />
          </div>

          { enterInput && (
              <input
                  type="text"
                  className="enter-data"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  inputMode="numeric"
                  pattern="[0-9]*"
              />
          ) }
        </div>

        <footer className='footer-slider'>
          { subtitleOne && (
              <div className="side-content">
                <span className="title-footer">{subtitleOne}</span>
                <span className="percents-title">{formatPercentage(percentageOne)}</span>
              </div>
          ) }

          { subtitleTwo && (
              <div className="side-content">
                <span className="title-footer">{subtitleTwo}</span>
                <span className="percents-title">{formatPercentage(percentageTwo)}</span>
              </div>
          ) }

        </footer>

      </div>
  )
}

export default Slider