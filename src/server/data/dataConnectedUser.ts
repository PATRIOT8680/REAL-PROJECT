import { rce } from "../utils/rce";

export interface IConnectedUser {
  sid?: number | null,
  login?: string | undefined,
  nickName?: string | undefined,
}

const users = new Map<number, IConnectedUser>()

export const connectedUsers = {
  setUser: (playerId: number, userData: Partial<IConnectedUser>): void => {
    const existingUser = users.get(playerId) || {}
    users.set(playerId, { ...existingUser, ...userData })

    if (userData.login) {
      console.log(`Обновлен пользователь: ${userData.login} (ID: ${playerId})`);
    }
  },

  removeUser: (playerId: number): boolean => {
    const user = users.get(playerId)
    if (user) {
      users.delete(playerId)
      console.log(`Удален пользователь: ${user.login || 'Unknown'} (ID: ${playerId})`);
      return true
    }

    return false
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
      if (user.nickName === nickName) {
        return playerId;
      }
    }
    return undefined
  }
}

rce.registerClientCef('dataOnlineUser:getField', (player: PlayerMp, field: keyof IConnectedUser) => {
  if (!player) {
    return `Игрок (ID: ${player.id}) не в сети!`
  }

  console.log(`Отправляем запрошенные данные: ${connectedUsers.getField(player.id, field)}`)
  return connectedUsers.getField(player.id, field)
})