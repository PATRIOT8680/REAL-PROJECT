import { data } from '../../database/mysql'

export const getSid = (login: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE login = ?'
    data.query(sql, [login], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].sid)
    })
  })
}