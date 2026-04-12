import './assets/styles/compiled-css/Speedometer.css'
import { memo, useRef, useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";

const Speedometer = memo(() => {
  const { speed, engine, doors, seatBelt } = useSelector((state: RootState) => state.speedVehReducer)

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

  const baseSize = 280
  const size = baseSize * scale
  const center = size / 2

  const arcRadius = 90 * scale
  const tickOuter = 95 * scale
  const tickInnerMajor = 85 * scale
  const tickInnerMinor = 90 * scale
  const labelRadius = tickOuter + 18 * scale

  const needleStartRadius = arcRadius - 25 * scale
  const needleEndRadius = arcRadius - 15 * scale
  const needleWidth = 3 * scale

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
        strokeWidth={isMajor ? 2 * scale : 1.5 * scale}
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
          style={{ fontSize: `${9 * scale}px` }}
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
      <div className="indicators-veh">
        <svg className={`indicator ${engine ? 'active' : ''}`} id='engine' width="45" height="33" viewBox="0 0 45 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.2727 0V4.125H18.4091V8.25H12.2727L8.18182 12.375V18.5625H4.09091V12.375H0V28.875H4.09091V22.6875H8.18182V28.875H14.3182L18.4091 33H34.7727V24.75H38.8636V30.9375H45V10.3125H38.8636V16.5H34.7727V8.25H22.5V4.125H28.6364V0H12.2727Z" fill="white"/>
        </svg>
        <svg className={`indicator ${!doors ? 'active' : ''}`} id='doors' width="41" height="38" viewBox="0 0 41 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.5263 23.2222H28.0526V27.4444H34.5263V23.2222ZM41 38H0V16.8889L17.2632 0H38.8421C39.4144 0 39.9633 0.22242 40.368 0.61833C40.7727 1.01424 41 1.55121 41 2.11111V38ZM19.0542 4.22222L6.10684 16.8889H36.6842V4.22222H19.0542Z" fill="white"/>
        </svg>
        <svg className={`indicator ${seatBelt ? 'active' : ''}`} id='seat-belt' width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5002 17.7692C14.7053 17.7692 12.9508 17.2482 11.4584 16.2719C9.96608 15.2957 8.80293 13.9081 8.11607 12.2846C7.42921 10.6612 7.2495 8.87476 7.59966 7.15132C7.94981 5.42787 8.81411 3.84478 10.0833 2.60225C11.3524 1.35971 12.9694 0.513534 14.7297 0.170719C16.4901 -0.172095 18.3148 0.0038496 19.973 0.676305C21.6312 1.34876 23.0485 2.48752 24.0457 3.94859C25.0428 5.40966 25.5751 7.12741 25.5751 8.88462C25.5723 11.2401 24.6154 13.4984 22.9141 15.164C21.2128 16.8296 18.9061 17.7666 16.5002 17.7692ZM31.35 38.7692H6.01455L30.7911 17.3654C30.8748 17.293 30.9508 17.2125 31.0179 17.1251C31.2441 16.8299 31.3611 16.4682 31.35 16.0993C31.3395 15.7931 31.2404 15.4962 31.064 15.2431C30.8877 14.99 30.6415 14.7912 30.3542 14.6699C30.0669 14.5486 29.7502 14.5099 29.4412 14.5581C29.1322 14.6063 28.8435 14.7396 28.609 14.9423L23.5477 19.3139C21.2343 18.2434 18.6984 17.7142 16.1402 17.7683C13.5821 17.8223 11.0718 18.4581 8.80786 19.6254C6.54388 20.7927 4.58823 22.4595 3.09544 24.4941C1.60266 26.5287 0.61367 28.8754 0.20662 31.3486C0.194527 31.422 0.187636 31.4963 0.185996 31.5707L0.000372605 40.3503C-0.00429519 40.5653 0.0349345 40.779 0.115761 40.979C0.196588 41.179 0.317385 41.3611 0.471067 41.5148C0.62475 41.6685 0.808223 41.7905 1.01073 41.8738C1.21323 41.9572 1.43069 42 1.65035 42H31.35C31.7876 42 32.2073 41.8298 32.5167 41.5269C32.8261 41.2239 33 40.813 33 40.3846C33 39.9562 32.8261 39.5453 32.5167 39.2424C32.2073 38.9394 31.7876 38.7692 31.35 38.7692ZM28.8998 24.0288C28.6688 24.0015 28.4346 24.0223 28.2125 24.0898C27.9903 24.1573 27.7852 24.27 27.6107 24.4206L14.7409 35.5385H31.35C31.7876 35.5385 32.2073 35.3683 32.5167 35.0653C32.8261 34.7624 33 34.3515 33 33.9231C33.006 30.6298 31.9786 27.4142 30.0568 24.7113C29.9241 24.5241 29.7523 24.3665 29.5529 24.2489C29.3535 24.1312 29.1309 24.0563 28.8998 24.0288Z" fill="white"/>
        </svg>
      </div>
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
            fontSize: `${28 * scale}px`,
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