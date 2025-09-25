export const getDateTime = async () => {
  try {
    const apiKey = 'KNICB5NO1LLX'
    const response = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=Europe/Moscow`)
    const data = await response.json()

    const dateTimeString = data.formatted
    const date = new Date(dateTimeString)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}`.toString()
  } catch (error) {
    console.error("Ошибка при получении времени:", error)
  }
}