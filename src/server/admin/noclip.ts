mp.events.add('client:noclip:setPos', (player: PlayerMp, x: number, y: number, z: number) => {
  player.position = new mp.Vector3(x, y, z)
})