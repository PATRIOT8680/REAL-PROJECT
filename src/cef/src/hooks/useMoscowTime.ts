import { useState, useEffect } from 'react'

const MOSCOW_OFFSET = 3 * 3600000

export const useMoscowTime = () => {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const moscowTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + MOSCOW_OFFSET)

      const pad = (n: number) => n.toString().padStart(2, '0')
      const hours = pad(moscowTime.getHours())
      const minutes = pad(moscowTime.getMinutes())

      const day = pad(moscowTime.getDate())
      const month = pad(moscowTime.getMonth() + 1)
      const year = moscowTime.getFullYear()

      setTime(`${hours}:${minutes}`)
      setDate(`${day}.${month}.${year}`)
    }

    updateTime()
    const interval = setInterval(() => updateTime(), 60000)

    return () => clearInterval(interval)
  }, [])

  return { time, date }
}