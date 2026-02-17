mp.events.add('playerJoin', (player) => {
  const socialClub = player.socialClub
  const whitelist = [ 'HaseNRP', 'Anaken74', 'whysh1n3', 'Kazeeken', 'Team1ALEX' ]

  if (!whitelist.includes(socialClub)) {
    player.kick('Вы не добавлены в Whitelist!')
    console.log(`Not in Whitelist: ${player.socialClub}`)
  }
})