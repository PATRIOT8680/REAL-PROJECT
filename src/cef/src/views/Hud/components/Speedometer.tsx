import './assets/styles/compiled-css/Speedometer.css'
import { memo, useRef, useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";

const Speedometer = memo(() => {
  const { speed } = useSelector((state: RootState) => state.speedVehReducer)

  // Получаем текущее значение --app-scale
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const root = document.documentElement
      const scaleValue = getComputedStyle(root).getPropertyValue('--app-scale').trim()
      const parsed = parseFloat(scaleValue)
      setScale(isNaN(parsed) ? 1 : parsed)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const MAX_SPEED = 240
  const SAFE_MAX = 160
  const MAJOR_STEP = 20
  const MINOR_STEP = 10

  const startAngle = -135
  const endAngle = 135
  const totalAngle = endAngle - startAngle

  const visibleMax = speed >= SAFE_MAX ? MAX_SPEED : SAFE_MAX

  // Базовый размер для Full HD
  const baseSize = 265
  const size = baseSize * scale
  const center = size / 2

  // Масштабируем все геометрические параметры
  const arcRadius = 90 * scale
  const tickOuter = 95 * scale
  const tickInnerMajor = 85 * scale
  const tickInnerMinor = 90 * scale
  const labelRadius = tickOuter + 18 * scale

  const needleStartRadius = arcRadius - 33 * scale
  const needleEndRadius = arcRadius - 17 * scale
  const needleWidth = 3.5 * scale

  const [animatedSpeed, setAnimatedSpeed] = useState(speed)

  const animationRef = useRef<number | null>(null)

  const getAngle = useMemo(() => (val: number) => {
    return startAngle + (val / MAX_SPEED) * totalAngle
  }, [MAX_SPEED, startAngle, totalAngle])

  const getPos = useMemo(() => (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180
    return {
      x: center + r * Math.sin(rad),
      y: center - r * Math.cos(rad),
    }
  }, [center])

  const calculateArcPath = useMemo(() => {
    const startPos = getPos(startAngle, arcRadius)
    const endPos = getPos(endAngle, arcRadius)

    return {
      path: `M ${startPos.x} ${startPos.y} A ${arcRadius} ${arcRadius} 0 ${totalAngle > 180 ? 1 : 0} 1 ${endPos.x} ${endPos.y}`,
      length: (Math.PI * arcRadius * totalAngle) / 180
    }
  }, [getPos, arcRadius, totalAngle, startAngle, endAngle])

  useEffect(() => {
    if (speed === animatedSpeed) return

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startTime = Date.now()
    const duration = 300
    const startSpeed = animatedSpeed
    const endSpeed = speed

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      const currentSpeed = startSpeed + (endSpeed - startSpeed) * easeOutCubic

      setAnimatedSpeed(currentSpeed)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatedSpeed(endSpeed)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed])

  const ticks: JSX.Element[] = []

  for (let v = 0; v <= visibleMax; v += MINOR_STEP) {
    const isMajor = v % MAJOR_STEP === 0
    const isDanger = v > SAFE_MAX
    const angle = getAngle(v)

    const outerR = isMajor ? tickOuter : arcRadius + 3 * scale
    const innerR = isMajor ? tickInnerMajor : tickInnerMinor

    const outer = getPos(angle, outerR)
    const inner = getPos(angle, innerR)

    ticks.push(
      <line
        key={`tick-${v}`}
        x1={outer.x}
        y1={outer.y}
        x2={inner.x}
        y2={inner.y}
        stroke="#ffffff"
        className={`tick ${isDanger ? 'showedHighSpeed' : ''}`}
        strokeWidth={isMajor ? 3 * scale : 1.5 * scale}
        strokeLinecap="round"
      />
    )

    if (isMajor) {
      const labelPos = getPos(angle, labelRadius)
      ticks.push(
        <text
          key={`label-${v}`}
          x={labelPos.x}
          y={labelPos.y}
          className={`designation-speed ${isDanger ? 'showedHighSpeed' : ''}`}
          textAnchor="middle"
          dominantBaseline="central"
          fill={isDanger ? '#FF4617' : '#ffffff'}
          style={{ fontSize: `${12 * scale}px` }}
        >
          {v}
        </text>
      )
    }
  }

  const needleAngle = getAngle(animatedSpeed)
  const needleStart = getPos(needleAngle, needleStartRadius)
  const needleEnd = getPos(needleAngle, needleEndRadius)

  const progressPercentage = Math.min(animatedSpeed, MAX_SPEED) / MAX_SPEED
  const dashLength = calculateArcPath.length * progressPercentage
  const gapLength = calculateArcPath.length - dashLength

  return (
    <div className="speedometer">
      <svg className='bg-shadow' width="259" height="259" viewBox="0 0 259 259" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="129.5" cy="129.5" r="129.5" fill="#131C33" fillOpacity="0.4" />
      </svg>
      <svg
        className='main-section'
        width={size}
        height={size - 20 * scale}
        viewBox={`0 0 ${size} ${size - 20 * scale}`}
      >
        <path
          d={calculateArcPath.path}
          fill="none"
          stroke={animatedSpeed > SAFE_MAX ? "#FF4617" : "#EFAC1D"}
          strokeWidth={18 * scale}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeDashoffset="0"
        />

        {ticks}

        <line
          x1={needleStart.x}
          y1={needleStart.y}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#FF0D4A"
          strokeWidth={needleWidth}
          strokeLinecap="round"
          style={{
            transition: 'x1 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), y1 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), x2 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), y2 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />

        <text
          className="speed-veh"
          x={center}
          y={center - 10 * scale}
          textAnchor="middle"
          dominantBaseline="central"
          fill={animatedSpeed > SAFE_MAX ? '#FF4617' : '#ffffff'}
          style={{
            fontSize: `${31 * scale}px`,
            transition: 'all 0.6s ease'
          }}
        >
          {Math.round(animatedSpeed)}
        </text>

        <text
          x={center}
          y={center + 30 * scale}
          fill="#555"
          textAnchor="middle"
          className='units'
          style={{ fontSize: `${11 * scale}px` }}
        >
          км / ч
        </text>
      </svg>
    </div>
  )
})

export default Speedometer