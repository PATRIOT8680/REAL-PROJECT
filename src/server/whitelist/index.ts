mp.events.add('playerJoin', (player) => {
  const socialClub = player.socialClub
  const whitelist = [ 'HaseNRP', 'saint_price' ]

  if (!whitelist.includes(socialClub)) {
    player.kick('Вы не добавлены в Whitelist!')
    console.log(`Not in Whitelist: ${player.socialClub}`)
  }
})