export const playAnim = (entity, animDict: string, animName: string) => {
  mp.game.streaming.requestAnimDict(animDict)
  entity.taskPlayAnim(animDict, animName, 8.0, 1.0, -1, 1, 1.0, false, false, false)
}