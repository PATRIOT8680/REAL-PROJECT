const applyUpperBody = (player: PlayerMp) => {
  if (!mp.players.exists(player) || !player.handle) {
    return;
  }

  const gender = player.model === mp.game.joaat('mp_m_freemode_01') ? 'male' : 'female'

  const jacket = player.getVariable('jacket') as { drawable: number; texture: number } | null | undefined
  const shirt  = player.getVariable('shirt')  as { drawable: number; texture: number } | null | undefined

  let topDrawable = 15
  let topTexture  = 0

  if (jacket && typeof jacket.drawable === 'number' && jacket.drawable > 0 && jacket.drawable !== 15) {
    topDrawable = jacket.drawable
    topTexture  = jacket.texture ?? 0
  } else if (shirt && typeof shirt.drawable === 'number' && shirt.drawable > 0 && shirt.drawable !== 15) {
    topDrawable = shirt.drawable
    topTexture  = shirt.texture ?? 0
  }

  player.setComponentVariation(11, topDrawable, topTexture, 2)

  let undershirtDrawable = 15
  let undershirtTexture  = 0

  if (shirt && shirt.drawable > 0) {
    undershirtDrawable = 0
    undershirtTexture  = shirt.texture ?? 0
  }

  player.setComponentVariation(8, undershirtDrawable, undershirtTexture, 2)

  let torsoDrawable = 15

  if (topDrawable !== 15) {
    torsoDrawable = 15
  }

  player.setComponentVariation(3, torsoDrawable, 0, 2);

  console.log(
    `[CLOTHES SYNC] Applied for player ${player.remoteId}: ` +
    `top=${topDrawable}/${topTexture}, undershirt=${undershirtDrawable}/${undershirtTexture}, torso=${torsoDrawable}`
  )
}

mp.events.add('entityStreamIn', (entity: EntityMp) => {
  if (entity.type !== 'player') {
    return
  }

  const player = entity as PlayerMp
  applyUpperBody(player)
})

mp.events.addDataHandler('jacket', (entity: EntityMp, value: any) => {
  if (entity.type === 'player') {
    applyUpperBody(entity as PlayerMp)
  }
})

mp.events.addDataHandler('shirt', (entity: EntityMp, value: any) => {
  if (entity.type === 'player') {
    applyUpperBody(entity as PlayerMp)
  }
})

mp.events.add('playerReady', () => {
  applyUpperBody(mp.players.local)
})