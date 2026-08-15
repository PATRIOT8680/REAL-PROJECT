import { rce } from "../utils/rce";
import { IConnectedUser } from "../../shared/types/connectedUsers";

const users = new Map<number, IConnectedUser>()

export const connectedUsers = {
  setUser: (playerId: number, userData: Partial<IConnectedUser>): void => {
    const existingUser = users.get(playerId) || {}
    users.set(playerId, { ...existingUser, ...userData })

    if (userData.uid) {
      rce.triggerClients('execute', `window.App.serverInfoReducer.addPlayer(${JSON.stringify(connectedUsers.getFullData(playerId))})`)
    }
  },

  removeUser: (playerId: number): boolean => {
    const user = users.get(playerId)
    if (user) {
      users.delete(playerId)
      rce.triggerClients('execute', `window.App.serverInfoReducer.removePlayer(${user.uid})`)
      console.log(`Удален пользователь: ${user.login || 'Unknown'} (ID: ${playerId})`)
      return true
    }

    return false
  },

  getFullData: (playerId: number): IConnectedUser | undefined => {
    return users.get(playerId)
  },

  getFullDataByUid: (uid: number): IConnectedUser | undefined => {
    for (const user of users.values()) {
      if (user.uid === uid) return user
    }
    return undefined
  },

  getUser: (playerId: number): IConnectedUser | undefined => {
    return users.get(playerId)
  },

  getUserByLogin: (login: string): { playerId: number, user: IConnectedUser } | undefined => {
    for (const [playerId, user] of users.entries()) {
      if (user.login === login) {
        return { playerId, user }
      }
    }
    return undefined
  },

  getAllUsers: (): Array<{ playerId: number, user: IConnectedUser }> => {
    return Array.from(users.entries().map(([playerId, user]) => ({ playerId, user })))
  },

  getOnline: (): number => {
    return users.size
  },

  getField: <K extends keyof IConnectedUser>(
      playerId: number,
      field: K
  ): IConnectedUser[K] | undefined => {
    const user = users.get(playerId)
    return user ? user[field] : undefined
  },

  getPlayerIdByNickName: (nickName: string): number | undefined => {
    for (const [playerId, user] of users.entries()) {
      const target = mp.players.at(playerId)
      if (target) {
        if (user.nickName === nickName) {
          return playerId;
        }
      } else return
    }
    return undefined
  },

  getPlayerIdByUid: (uid: number): number | undefined => {
    for (const [playerId, user] of users.entries()) {
      const target = mp.players.at(playerId)
      if (target) {
        if (user.uid === uid) {
          return playerId
        }
      } else return
    }
    return undefined
  },

  getPlayerByUid: (uid: number): PlayerMp | undefined => {
    const playerId = connectedUsers.getPlayerIdByUid(uid)
    if (playerId !== undefined) {
      return mp.players.at(playerId)
    }
    return undefined
  }
}

rce.registerClientCef('dataOnlineUser:getField', (player: PlayerMp, targetId: number, field: keyof IConnectedUser) => {
  if (!mp.players.at(targetId)) {
    return `Игрок (ID: ${player.id}) не в сети!`
  }

  return connectedUsers.getField(targetId, field)
})