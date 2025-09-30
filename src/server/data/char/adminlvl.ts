import { data } from '../../database/mysql'
import { rce } from "../../utils/rce";

export const getAdminLvl = (uid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE uid = ?'
    data.query(sql, [uid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].adminlvl)
    })
  })
}

export const setAdminLvl = (uid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE uid = ?'
    data.query(sql, [uid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].adminlvl)
    })
  })
}