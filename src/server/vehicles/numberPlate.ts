import { data } from "../database/mysql";
import chalk from "chalk";

const db = data.promise()

export const generateRandomUSPlate = (): string => {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"

  if (Math.random() > 0.5) {
    let plate = ''

    for (let i = 0; i < 3; i++) {
      plate += letters[Math.floor(Math.random() * letters.length)]
    }

    for (let i = 0; i < 4; i++) {
      plate += Math.floor(Math.random() * 10)
    }

    return plate
  } else {
    let plate = Math.floor(Math.random() * 10).toString()
    plate += letters[Math.floor(Math.random() * letters.length)]
    plate += Math.floor(Math.random() * 10)
    plate += letters[Math.floor(Math.random() * letters.length)] + " "
    plate += Math.floor(100 + Math.random() * 900)
    return plate
  }
}

const isPlateExist = async (plate: string): Promise<boolean> => {
  try {
    const [rows]: any = await db.query(`
      SELECT COUNT(*) AS cnt
      FROM chars
      WHERE rent_data IS NOT NULL AND JSON_EXTRACT(rent_data, '$.plate') = ?
    `, [plate])

    return rows[0].cnt > 0
  } catch (e) {
    console.log(chalk.red('[CHECK PLATE]') + ` Ошибка проверки номерного знака в БД: ${e}`)
    return false
  }
}

export const generateUSPlate = async (): Promise<string> => {
  const MAX_ATTEMPTS = 50

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const plate = generateRandomUSPlate()
    const exist = await isPlateExist(plate)

    if (!exist) return plate
  }

  return 'ERR'
}