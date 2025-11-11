import { getNumberChar } from "./numberChar";
import { data } from "../../database/mysql";
import { listLoginAccs } from "../../menus/auth/login";

const getPlayerIdBySid = (sid: number) =>
    [...listLoginAccs.entries()].find(([id, data]) => data.sid === sid)?.[0];

export const getUid = (sid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE sid = ? AND numberslot = ?'
    const numberSlot = getNumberChar(getPlayerIdBySid(sid))
    console.log(`Number slot: ${numberSlot}`)
    data.query(sql, [sid, numberSlot], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].uid)
    })
  })
}