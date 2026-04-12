import './assets/styles/compiled-css/Fuel.css'
import { memo, useRef, useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducer.ts'

const Fuel = memo(() => {
  const { fuel } = useSelector((state: RootState) => state.fuelVehReducer)

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

  const MAX_FUEL = 100
  const WARNING_LEVEL = 15

  const MAJOR_STEP = 20
  const MINOR_STEP = 10

  const startAngle = -135
  const endAngle = 135
  const totalAngle = endAngle - startAngle

  const visibleMax = MAX_FUEL

  const baseSize = 160
  const size = baseSize * scale
  const center = size / 2

  const arcRadius = 52 * scale
  const tickOuter = 56 * scale
  const tickInnerMajor = 48 * scale
  const tickInnerMinor = 52 * scale

  const needleStartRadius = arcRadius - 14 * scale
  const needleEndRadius = arcRadius - 8 * scale
  const needleWidth = 2 * scale

  const [animatedFuel, setAnimatedFuel] = useState(fuel)
  const animationRef = useRef<number | null>(null)

  const getAngle = useMemo(() => (val: number) => {
    return startAngle + (val / MAX_FUEL) * totalAngle
  }, [MAX_FUEL, startAngle, totalAngle])

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
    if (fuel === animatedFuel) return

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startTime = Date.now()
    const duration = 300
    const startFuel = animatedFuel
    const endFuel = fuel

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentFuel = startFuel + (endFuel - startFuel) * easeOutCubic

      setAnimatedFuel(currentFuel)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatedFuel(endFuel)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [fuel])

  const ticks: JSX.Element[] = []

  for (let v = 0; v <= visibleMax; v += MINOR_STEP) {
    const isMajor = v % MAJOR_STEP === 0
    const isLow = v < WARNING_LEVEL
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
        className={`tick ${isLow ? 'showedLowFuel' : ''}`}
        strokeWidth={isMajor ? 2 * scale : 1.5 * scale}
        strokeLinecap="round"
      />
    )
  }

  const needleAngle = getAngle(animatedFuel)
  const needleStart = getPos(needleAngle, needleStartRadius)
  const needleEnd = getPos(needleAngle, needleEndRadius)

  const progressPercentage = Math.min(animatedFuel, MAX_FUEL) / MAX_FUEL
  const dashLength = calculateArcPath.length * progressPercentage
  const gapLength = calculateArcPath.length - dashLength

  const arcColor = animatedFuel < WARNING_LEVEL ? '#FF4617' : '#EFAC1D'

  return (
    <div className="fuel-meter">
      <svg className='icon-fuel' width="30" height="33" viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.4545 12.8333C24.9723 12.8333 24.5099 12.6402 24.1689 12.2964C23.8279 11.9525 23.6364 11.4862 23.6364 11C23.6364 10.5138 23.8279 10.0475 24.1689 9.70364C24.5099 9.35982 24.9723 9.16667 25.4545 9.16667C25.9368 9.16667 26.3992 9.35982 26.7402 9.70364C27.0812 10.0475 27.2727 10.5138 27.2727 11C27.2727 11.4862 27.0812 11.9525 26.7402 12.2964C26.3992 12.6402 25.9368 12.8333 25.4545 12.8333ZM14.5455 12.8333H3.63636V3.66667H14.5455M28.6727 7.755L28.6909 7.73667L21.9273 0.916667L20 2.86L23.8364 6.72833C22.1273 7.33333 20.9091 9.03833 20.9091 11C20.9091 11.6019 21.0267 12.1979 21.2551 12.754C21.4835 13.31 21.8183 13.8153 22.2404 14.2409C23.0929 15.1004 24.249 15.5833 25.4545 15.5833C26.1091 15.5833 26.7091 15.4367 27.2727 15.1983V28.4167C27.2727 28.9029 27.0812 29.3692 26.7402 29.713C26.3992 30.0568 25.9368 30.25 25.4545 30.25C24.9723 30.25 24.5099 30.0568 24.1689 29.713C23.8279 29.3692 23.6364 28.9029 23.6364 28.4167V20.1667C23.6364 19.1942 23.2532 18.2616 22.5713 17.5739C21.8893 16.8863 20.9644 16.5 20 16.5H18.1818V3.66667C18.1818 2.69421 17.7987 1.76158 17.1168 1.07394C16.4348 0.386308 15.5099 0 14.5455 0H3.63636C1.61818 0 0 1.63167 0 3.66667V33H18.1818V19.25H20.9091V28.4167C20.9091 29.6322 21.388 30.798 22.2404 31.6576C23.0929 32.5171 24.249 33 25.4545 33C26.0515 33 26.6425 32.8814 27.194 32.6511C27.7455 32.4208 28.2466 32.0832 28.6687 31.6576C29.0908 31.232 29.4256 30.7267 29.654 30.1706C29.8824 29.6146 30 29.0186 30 28.4167V11C30 9.735 29.4909 8.58 28.6727 7.755Z" fill="white"/>
      </svg>
      <svg
        className='main-section'
        width={size}
        height={size - 15 * scale}
        viewBox={`0 0 ${size} ${size - 15 * scale}`}
      >
        <path
          d={calculateArcPath.path}
          fill="none"
          stroke={arcColor}
          strokeWidth={12 * scale}
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
      </svg>
    </div>
  )
})

export default Fuel