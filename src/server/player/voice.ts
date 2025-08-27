mp.events.add('client:voice:new', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.enableVoiceTo(target)
})

mp.events.add('client:voice:deleted', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.disableVoiceTo(target)
})