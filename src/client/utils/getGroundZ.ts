import { rce } from "./rce";

rce.registerAll('getGroundZ', () => {
  const pos = mp.players.local.position
  return mp.game.gameplay.getGroundZFor3DCoord(pos.x, pos.y, pos.z, false, false)
})