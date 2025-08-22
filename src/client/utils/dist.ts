import { rce } from "./rce";

export const getDist = (x1, y1, z1, x2, y2, z2) => {
  mp.game.system.vdist(x1, y1, z1, x2, y2, z2);
}

rce.registerAll('getDist', (x1, y1, z1, x2, y2, z2) => {
  return getDist(x1, y1, z1, x2, y2, z2)
})