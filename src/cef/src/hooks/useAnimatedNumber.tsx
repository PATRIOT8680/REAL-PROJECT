import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(
  targetValue: number,
  duration: number = 300
): number {
  const [currentValue, setCurrentValue] = useState<number>(targetValue)
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef<number>(targetValue)

  useEffect(() => {
    startValueRef.current = currentValue
    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      if (!startTimeRef.current) return

      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      const nextValue = startValueRef.current + (targetValue - startValueRef.current) * progress

      setCurrentValue(nextValue)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentValue(targetValue)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [targetValue, duration])

  return currentValue
}