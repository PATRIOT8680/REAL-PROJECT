import { rce } from "../utils/rce";
import { connectedUsers } from "../data/dataConnectedUser";
import { data } from "../database/mysql";
import { broadcast } from "../menus/chat";
import { getNickname } from "../data/char/nickname";

import chalk from "chalk";

const db = data.promise()

const checkAdminLvl = (player: PlayerMp) => {
  const alvl = connectedUsers.getField(player.id, 'adminLvl')
  if (alvl === 0) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Нет доступа!', 2500, 'top')
    return false
  } else return true
}

export const banPlayer = async (player: PlayerMp, uid: number, days: number, reason: string) => {
  const adminData = connectedUsers.getFullData(player.id)

  try {
    const [check]: any = await db.query(
      `SELECT uid, firstname, lastname, adminlvl, ban FROM chars WHERE uid = ? LIMIT 1`,
      [uid]
    )

    if (!check || check.length === 0) {
      rce.triggerClient(player, 'sendNotify', 'err', `UID ${uid} не найден в базе данных!`, 3200, 'top')
      return
    }

    const char = check[0]
    const nickname = `${char.firstname} ${char.lastname}`

    if (char.ban) {
      rce.triggerClient(player, 'sendNotify', 'warning', `Игрок ${nickname} (#${uid}) уже забанен!`, 3200, 'top')
      return
    }

    if (char.adminlvl > 0 && adminData.adminLvl < 8) {
      rce.triggerClient(player, 'sendNotify', 'err', `Нет доступа!`, 3000, 'top')
      return
    }

    const banData = {
      days: days,
      reason: reason,
      bannedBy: player.name || 'Unknown',
      bannedAt: new Date().toISOString()
    }

    await db.query(
      `UPDATE chars SET ban = ? WHERE uid = ?`,
      [JSON.stringify(banData), uid]
    )

    const target = connectedUsers.getPlayerByUid(uid)
    if (target) target.kick(`Заблокирован на ${days} дн. по причине: "${reason}"`)

    rce.triggerClient(player, 'sendNotify', 'success', `Игрок ${nickname} успешно забанен на ${days} дн.`, 4000, 'top')
    broadcast(
      `{ff3030}<b>${nickname} #${uid}</b> заблокирован на <b>${days} дн.</b> по причине: <b>${reason}</b> | by ${adminData.nickName}`,
      true, 'Server'
    )
    console.log(chalk.blueBright('[BAN]') +
      ` ${nickname} был забанен на ${days} дн. админом ${adminData.nickName} | ${reason}`
    )
  } catch (e) {
    console.log(chalk.red('[BAN PLAYER]') + ` Err insert: ${e}`)
  }
}

export const tpToPlayer = (player: PlayerMp, targetUid: number) => {
  const target = connectedUsers.getPlayerByUid(targetUid)

  if (target) {
    if (target.id === player.id) {
      rce.triggerClient(player, 'sendNotify', 'err', 'Нельзя телепортироваться к самому себе!', 3200, 'top')
      return
    }

    const tPos = target.position
    rce.triggerClient(player, 'closeAMenu')
    rce.triggerClient(player, 'execute', 'window.App.loadingReducer.showLoading(1000)')
    rce.triggerClient(player, 'sendNotify', 'success', `Вы телепортировались к игроку #${targetUid}`, 2500, 'top')
    player.position = new mp.Vector3(tPos.x + 1, tPos.y, tPos.z)
  } else {
    rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не найден!', 3200, 'top')
  }
}

export const revivePlayer = (player: PlayerMp, targetUid: number) => {
  const target = connectedUsers.getPlayerByUid(targetUid)
  const { nickName, uid } = connectedUsers.getFullData(player.id)

  if (target) {
    rce.triggerClient(target, 'playerRevive', 'reborn')
    rce.triggerClient(target, 'sendNotify', 'success', `Вас реанимировал ${nickName} #${uid}`, 3200, 'top')
  } else {
    rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не найден!', 3200, 'top')
  }
}

rce.registerCef('admin:tpToPlayer', (player: PlayerMp, targetUid: number) => {
  if (checkAdminLvl(player)) tpToPlayer(player, targetUid)
})

rce.registerCef('admin:playerBan', (player: PlayerMp, uid: number, days: number, reason: string) => {
  if (checkAdminLvl(player)) banPlayer(player, uid, days, reason)
})

rce.registerCef('admin:revive', (player: PlayerMp, targetUid: number) => {
  if (checkAdminLvl(player)) revivePlayer(player, targetUid)
})