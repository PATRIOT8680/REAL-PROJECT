import { data } from "../../database/mysql";

export const getDonatCoins = (sid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE sid = ?'
    data.query(sql, [sid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].donatcoins)
    })
  })
}