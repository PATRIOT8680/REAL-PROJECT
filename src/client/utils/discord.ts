
const updateDiscord = () => {
  const player: PlayerMp = mp.players.local

  let subtitle: string

  if (player.getVariable('player_spawned') === undefined) {
    subtitle = 'Входит в аккаунт'
  } else if (player.isInAnyVehicle(false)) {
    if (player.getSeatIsTryingToEnter() !== -3) {
      subtitle = 'Сидит в транспорте'
    } else {
      subtitle = 'Управляет транспортом'
    }
  } else if (player.getVariable('player_knockout')) {
    subtitle = 'Без сознания...'
  } else if (player.isInWater()) {
    subtitle = 'Плавает'
  } else {
    subtitle = 'Странствует по штату'
  }

  mp.discord.update(subtitle, 'REAL RP')
}

setInterval(updateDiscord, 10000)