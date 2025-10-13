export const getDateTime = (): string => {
  const MOSCOW_UTC_OFFSET = 3 * 3600000

  const pad = (n: number): string => n.toString().padStart(2, '0')

  const getMoscowTime = (): Date => {
    const now = new Date()
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + MOSCOW_UTC_OFFSET)
  }

  const moscowTime = getMoscowTime()

  const day = pad(moscowTime.getDate())
  const month = pad(moscowTime.getMonth() + 1)
  const year = moscowTime.getFullYear()
  const hours = pad(moscowTime.getHours())
  const minutes = pad(moscowTime.getMinutes())
  const seconds = pad(moscowTime.getSeconds())

  return `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}`
}