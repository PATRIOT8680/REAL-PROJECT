import { rce } from "../utils/rce"
import { data } from "../database/mysql"

const db = data.promise()

rce.registerClient('checkWhitelist', async (player: PlayerMp) => {
  const [result]: any = await db.query(`SELECT whitelist_enabled FROM server_settings`)
  const whitelistEnabled = result[0].whitelist_enabled ?? false

  if (!whitelistEnabled) return { existing: true, haveRequest: false }

  const socialClub = player.socialClub
  const [requestResult]: any = await db.query(`SELECT 1 FROM requests_whitelist WHERE social_club = ?`, [socialClub])
  const [existingInWhitelist]: any = await db.query(`SELECT 1 FROM whitelist WHERE social_club = ?`, [socialClub])
  const haveRequest = requestResult.length > 0
  const inWhitelist = existingInWhitelist.length > 0

  return { existing: inWhitelist, haveRequest: haveRequest }
})

rce.registerCef('sendRequestWhitelist', async (player: PlayerMp, discord: string) => {
  const [checkRequests]: any = await db.query(`SELECT * FROM requests_whitelist WHERE social_club`, [player.socialClub])
  if (checkRequests.length > 0) {
    rce.triggerClient(player, 'sendNotify', 'err', 'У вас уже подана заявка! Ожидайте одобрения', 3200, 'top')
    return
  }

  await db.execute(
    `INSERT INTO requests_whitelist (social_club, discord, createdAt) VALUES (?, ?, ?)`,
    [player.socialClub, discord, new Date()]
  )
})