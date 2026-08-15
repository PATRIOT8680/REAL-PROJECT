import { IConnectedUser } from "../../../../../shared/types/connectedUsers.ts";

export const setPlayers = (playersData: IConnectedUser[]) => {
  return { type: 'SET_PLAYERS_DATA', playersData }
}

export const addPlayer = (player: IConnectedUser) => {
  return { type: 'ADD_PLAYER_DATA', player }
}

export const removePlayer = (uid: number) => {
  return { type: 'REMOVE_PLAYER_DATA', uid }
}