import { data } from "../database/mysql";
import { connectedUsers } from "../data/dataConnectedUser";
import { rce } from "../utils/rce";
import chalk from "chalk";

interface IFriendInfo {
  uid: number,
  nickname: string,
  online: boolean,
  playerId?: number,
  age: number,
  lvl: number,
  exp: number,
  adminLvl: number
}

export const getFriends = (player: PlayerMp) => {
  return new Promise((resolve, reject) => {
    const uid = connectedUsers.getField(player.id, 'uid')

    if (!uid) {
      reject(new Error('UID not found'))
      return
    }

    const sql = `SELECT friends FROM chars WHERE uid = ?`
    data.query(sql, [uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• FRIENDS •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      if (results.length === 0) {
        resolve([])
        return
      }

      try {
        const friendsUids: number[] = JSON.parse(results[0].friends || '[]')

        if (friendsUids.length === 0) {
          resolve([])
          return
        }

        const onlineFriends: IFriendInfo[] = []
        const offlineUids: number[] = []

        for (const friendUid of friendsUids) {
          let foundOnline = false

          for (const { playerId, user } of Array.from(connectedUsers.getAllUsers())) {
            if (user.uid === friendUid) {
              onlineFriends.push({
                uid: friendUid,
                nickname: user.nickName || '',
                online: true,
                playerId: playerId,
                age: user.age || 0,
                lvl: user.lvl || 0,
                exp: user.exp || 1,
                adminLvl: user.adminLvl || 0
              })
              foundOnline = true
              break
            }

            if (!foundOnline) {
              offlineUids.push(friendUid)
            }
          }

          if (offlineUids.length > 0) {
            const placeholders = offlineUids.map(() => '?').join(',')
            const sqlOffline = `
              SELECT
                c.uid,
                c.firstname,
                c.lastname,
                c.age,
                c.lvl,
                c.exp,
                c.adminLvl
              FROM chars c
              WHERE c.uid IN (${placeholders})
            `

            data.query(sqlOffline, offlineUids, (err, offlineResults: any[]) => {
              if (err) {
                console.log(chalk.bgRed('• FRIENDS •') + chalk.red(` Offline friends: ${err}`))
                resolve(onlineFriends)
                return
              }

              const offlineFriends: IFriendInfo[] = offlineResults.map(friend => ({
                uid: friend.uid,
                nickname: `${friend.firstname} ${friend.lastname}` || '',
                online: false,
                age: friend.age,
                lvl: friend.lvl,
                exp: friend.exp,
                adminLvl: friend.adminLvl
              }))

              resolve([...onlineFriends, ...offlineFriends])
            })
          } else {
            resolve(onlineFriends)
          }
        }
      } catch (e) {
        console.log(chalk.bgRed('• FRIENDS •') + chalk.red(` Err try: ${e}`))
        reject(e)
      }
    })
  })
}