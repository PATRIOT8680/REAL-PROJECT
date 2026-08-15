import { rce } from "../utils/rce";
<<<<<<< HEAD
import { IConnectedUser } from "../../shared/types/connectedUsers";
=======

export interface IConnectedUser {
  sid?: number | null,
  login?: string | undefined,
  uid?: number | null,
  nickName?: string | undefined,
  gender?: 'male' | 'female',
  adminLvl?: number | null,
  age?: number | null,
  cash?: number | null,
  bankmoney?: number | null,
  donatcoins?: number | null,
  lvl?: number | null,
  exp?: number | null,
  unique_quest?: string | null
}
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

const users = new Map<number, IConnectedUser>()

export const connectedUsers = {
  setUser: (playerId: number, userData: Partial<IConnectedUser>): void => {
    const existingUser = users.get(playerId) || {}
    users.set(playerId, { ...existingUser, ...userData })

<<<<<<< HEAD
    if (userData.uid) {
      rce.triggerClients('execute', `window.App.serverInfoReducer.addPlayer(${JSON.stringify(connectedUsers.getFullData(playerId))})`)
=======
    if (userData.login) {
      rce.triggerClient(mp.players.at(playerId), 'execute', `window.App.serverInfoReducer.setOnline(${connectedUsers.getOnline()})`)
      console.log(`Обновлен пользователь: ${userData.login} (ID: ${playerId})`);
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
    }
  },

  removeUser: (playerId: number): boolean => {
    const user = users.get(playerId)
    if (user) {
      users.delete(playerId)
<<<<<<< HEAD
      rce.triggerClients('execute', `window.App.serverInfoReducer.removePlayer(${user.uid})`)
=======
      rce.triggerClient(mp.players.at(playerId), 'execute', `window.App.serverInfoReducer.setOnline(${connectedUsers.getOnline()})`)
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
      console.log(`Удален пользователь: ${user.login || 'Unknown'} (ID: ${playerId})`)
      return true
    }

    return false
  },

<<<<<<< HEAD
  getFullData: (playerId: number): IConnectedUser | undefined => {
    return users.get(playerId)
  },

  getFullDataByUid: (uid: number): IConnectedUser | undefined => {
    for (const user of users.values()) {
      if (user.uid === uid) return user
    }
    return undefined
  },

=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
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