import {data} from "../../database/mysql";

export const getNickname = (uid: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE uid = ?'
    data.query(sql, [uid], (err, result) => {
      if (err) reject(err)
      else {
        const { firstname, lastname } = result[0]
        const fullName = `${firstname || ''} ${lastname || ''}`.trim()
        resolve(fullName)
      }
    })
  })
}