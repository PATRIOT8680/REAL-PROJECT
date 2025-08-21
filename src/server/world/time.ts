import chalk from 'chalk'
import { rce } from '../utils/rce'

let currentDateTime = {
  year: 0,
  month: 0,
  day: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
}

let timeUpdateTimer: NodeJS.Timeout
let MOSCOW_UTC_OFFSET = 3 * 3600000
const pad = (n: number) => n.toString().padStart(2, '0')


const getMoscowTime = (): Date => {
  const now = new Date()
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + MOSCOW_UTC_OFFSET)
}

const updateTime = (isFirstRun: boolean = false) => {
  const moscowTime = getMoscowTime()

  currentDateTime = {
    year: moscowTime.getFullYear(),
    month: moscowTime.getMonth() + 1,
    day: moscowTime.getDate(),
    hours: moscowTime.getHours(),
    minutes: moscowTime.getMinutes(),
    seconds: moscowTime.getSeconds()
  }

  //mp.world.time.set(currentDateTime.hours, currentDateTime.minutes, currentDateTime.seconds)
  mp.world.time.set(8, 0, 0)

  if (!isFirstRun) {
    console.log(`Time: ${pad(currentDateTime.hours)}:${pad(currentDateTime.minutes)}`)
  }

  const nextMinute = (60 - moscowTime.getSeconds()) * 1000 - moscowTime.getMilliseconds()
  clearTimeout(timeUpdateTimer)
  timeUpdateTimer = setTimeout(() => {
    updateTime()
  }, nextMinute)
}


export const initTimeSystem = () => {
  updateTime(true)
  console.log(chalk.bgBlueBright('• DATETIME •') + ` Дата и время были инициализированы`)
}


const getDateTime = (date: boolean = true, time: boolean = true) => {
  const { day, month, year, hours, minutes, seconds } = currentDateTime

  if (!date && !time) return {}

  return {
    ...(date && { day, month, year }),
    ...(time && { hours, minutes, seconds })
  }
}


const getFormatedDateTime = (date: boolean = true, time: boolean = true, fullTime: boolean = false) => {
  const { day, month, year, hours, minutes, seconds } = currentDateTime

  if (!date && !time) return {}

  const datePart = date ? `${pad(day)}.${pad(month)}.${year}` : ''
  const timePart = time ? `${pad(hours)}:${pad(minutes)}${fullTime ? `:${pad(seconds)}` : ''}` : ''

  return [datePart, timePart].filter(Boolean).join(' ')
}

rce.registerClientAndCef('getDateTime', (player: PlayerMp, date: boolean, time: boolean) => {
  return getDateTime(date, time)
})

rce.registerClientAndCef('getFormatedDateTime', (player: PlayerMp, date: boolean, time: boolean, fullTime: boolean) => {
  return getFormatedDateTime(date, time, fullTime)
})
