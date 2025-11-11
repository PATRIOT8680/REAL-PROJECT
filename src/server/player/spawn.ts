import {rce} from "../utils/rce";
import { connectedUsers } from "../data/dataConnectedUser";

mp.events.add('playerJoin', (player: PlayerMp) => {
  player.dimension = player.id + 1
  //console.log(`${player.socialClub} подключился!!! dim: ${player.dimension}`)

  player.model = mp.joaat('mp_m_freemode_01')
  player.spawn(new mp.Vector3(3335.050537109375, 5162.82177734375, 18.2938232421875))
  player.heading = 144
  player.health = 100
  player.armour = 200

  connectedUsers.setUser(player.id, {
    sid: null,
    login: undefined,
    nickName: undefined,
    adminLvl: null,
    age: null,
    cash: null,
    bankmoney: null,
    lvl: null,
    exp: null,
  })
})