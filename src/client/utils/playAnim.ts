import { rce } from "./rce";

export const playAnim = (animDict: string, animName: string, flag: number, duration: number) => {
  mp.game.streaming.requestAnimDict(animDict)
  setTimeout(() => {
    mp.players.local.taskPlayAnim(animDict, animName, 8.0, 1.0, duration, flag, 1.0, false, false, false)
  }, 350)
}

rce.registerAll('playAnim', (animDict: string, animName: string, flag: number, duration: number) => {
  playAnim(animDict, animName, flag, duration)
})