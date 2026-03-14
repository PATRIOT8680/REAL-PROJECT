import React from 'react';
import { useAnimatedNumber } from "../hooks/useAnimatedNumber.tsx";
import { formatedMoney } from "../modules/formatedMoney.ts";

interface AnimatedNumberProps {
  value: number
  className: string
  duration?: number
  format?: boolean
  prefix?: string
  suffix?: string
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className,
  duration = 300,
  format = true,
  prefix = '',
  suffix = '',
}) => {
  const animatedValue = useAnimatedNumber(value, duration)
  const displayValue = format ? formatedMoney(animatedValue) : animatedValue.toString()

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export default AnimatedNumber