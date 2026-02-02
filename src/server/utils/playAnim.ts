export const playAnim = (player: PlayerMp, dict: string, name: string, flag: number, duration: number) => {
  if (!player) return
  if (!dict || !name || !flag || !duration) return
  if (duration <= 0) return

  player.playAnimation(dict, name, 1, flag)

  setTimeout(() => {
    player.stopAnimation()
  }, duration)
}