import { store } from "../store.ts";
import { setOnline } from "../../actions/elements/serverInfo/online.ts";
import { setPlayers, addPlayer, removePlayer } from "../../actions/elements/serverInfo/playersData.ts";

import { IConnectedUser } from "../../../../shared/types/connectedUsers.ts";

export const serverInfoStore = {
  setOnline: (online: number) => store.dispatch(setOnline(online)),
  setPlayers: (playersData: IConnectedUser[]) => store.dispatch(setPlayers(playersData)),
  addPlayer: (player: IConnectedUser) => store.dispatch(addPlayer(player), console.log(`add pl: ${player}`)),
  removePlayer: (uid: number) => store.dispatch(removePlayer(uid)),
}