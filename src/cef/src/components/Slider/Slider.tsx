import './assets/styles/compiled-css/Index.css'
import svg_arrow from './assets/img/arrow.svg'

import { CSSProperties, useState, useEffect, useRef } from "react"
import AnimatedNumber from "../AnimatedNumber"

interface ISlider {
  title?: string
  value: number
  onChange: (value: number) => void
  minVal: number
  maxVal: number
  step: number
  enterInput: boolean
  random: boolean
  subtitleOne?: string
  subtitleTwo?: string
  showedPercents?: boolean
  showedValues?: boolean
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
  showedPercents,
  showedValues
}: ISlider) => {
  const [inputValue, setInputValue] = useState<string>(
    (value >= minVal && value <= maxVal) ? value.toString() : minVal.toString()
  )

  const [displayValue, setDisplayValue] = useState<number>(value)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const animationRef = useRef<number>()
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging && animationRef.current === undefined) {
      setDisplayValue(value)
    }
  }, [value, isDragging])

  useEffect(() => {
    if (value >= minVal && value <= maxVal) {
      setInputValue(value.toString())
    } else {
      setInputValue(minVal.toString())
      onChange(minVal)
    }
  }, [value, minVal, maxVal, onChange])

  const fillPercent = ((displayValue - minVal) / (maxVal - minVal)) * 100

  const formatPercentage = (num: number) => {
    return Number.isInteger(num) ? `${num}%` : `${num.toFixed(0)}%`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (!/^\d*$/.test(newValue)) return
    setInputValue(newValue)

    if (newValue !== '' && /^\d+$/.test(newValue)) {
      const numValue = parseInt(newValue, 10)
      if (numValue >= minVal && numValue <= maxVal) {
        onChange(numValue)
        setDisplayValue(numValue)
      }
    }
  }

  const handleInputBlur = () => {
    let numValue = parseInt(inputValue, 10)
    if (isNaN(numValue) || numValue < minVal) numValue = minVal
    else if (numValue > maxVal) numValue = maxVal
    setInputValue(numValue.toString())
    onChange(numValue)
    setDisplayValue(numValue)
  }

  const handleRandomClick = () => {
    const stepCount = Math.floor((maxVal - minVal) / step)
    const randomStep = Math.floor(Math.random() * (stepCount + 1))
    const randomValue = minVal + randomStep * step
    onChange(randomValue)
    setDisplayValue(randomValue)
    setInputValue(randomValue.toString())
  }

  const getValueFromClick = (clientX: number): number => {
    if (!trackRef.current) return displayValue
    const rect = trackRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    let percent = offsetX / rect.width
    percent = Math.max(0, Math.min(1, percent))
    const rawValue = minVal + percent * (maxVal - minVal)
    const steppedValue = Math.round(rawValue / step) * step
    return Math.min(maxVal, Math.max(minVal, steppedValue))
  }

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault()
      const newValue = getValueFromClick(moveEvent.clientX)
      onChange(newValue)
      setDisplayValue(newValue)
    }

    const onMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return
    const targetVal = getValueFromClick(e.clientX)

    const startValue = displayValue
    const diff = targetVal - startValue
    const startTime = performance.now()
    const duration = 300

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = startValue + diff * progress

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onChange(targetVal)
        setDisplayValue(targetVal)
        animationRef.current = undefined
      }
    }

    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="main-slider">
      <header className="header-slider">
        {title && <span className="title">{title}</span>}
        {random && (
          <svg onClick={handleRandomClick} className='random-btn' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.95611 5.45722L1.48833 0L0 1.48833L5.45722 6.94555L6.95611 5.45722ZM11.0833 0L13.2367 2.15333L0 15.4006L1.48833 16.8889L14.7356 3.65222L16.8889 5.80556V0H11.0833ZM11.4317 9.93278L9.94333 11.4211L13.2472 14.725L11.0833 16.8889H16.8889V11.0833L14.7356 13.2367L11.4317 9.93278Z" fill="#888888" />
          </svg>
        )}
        {!random && showedValues && (
          <AnimatedNumber value={Math.round(displayValue)} className='value-slider' format={false} duration={200} />
        )}
      </header>

      <div className="container-slider">
        <div className="range-container">
          <img className='arrow' src={svg_arrow} alt="arrow" />
          <div
            className="slider-track"
            ref={trackRef}
            onClick={handleTrackClick}
          >
            <div
              className="slider-fill"
              style={{ width: `${fillPercent}%` }}
            />
            <div
              className="slider-thumb"
              ref={thumbRef}
              style={{ left: `${fillPercent}%` }}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
          <img className='arrow right' src={svg_arrow} alt="arrow" />
        </div>

        {enterInput && (
          <input
            type="text"
            className="enter-data"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        )}
      </div>

      <footer className='footer-slider'>
        {subtitleOne && (
          <div className="side-content">
            <span className="title-footer">{subtitleOne}</span>
            {showedPercents && (
              <span className="percents-title">{formatPercentage(((displayValue - minVal) / (maxVal - minVal)) * 100)}</span>
            )}
          </div>
        )}
        {subtitleTwo && (
          <div className="side-content">
            <span className="title-footer">{subtitleTwo}</span>
            {showedPercents && (
              <span className="percents-title">{formatPercentage(100 - ((displayValue - minVal) / (maxVal - minVal)) * 100)}</span>
            )}
          </div>
        )}
      </footer>
    </div>
  )
}

export default Slider