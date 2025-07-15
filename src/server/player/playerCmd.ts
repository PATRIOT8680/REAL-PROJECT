//import { broadcast, registerCMD, send } from '../menus/chat'

//registerCMD('me', (player: PlayerMp, args) => {
//  const text = args.join(' ')

//  if (!text) {
//    send(player, 'Используйте <b>/me [текст]</b>', false)
//    return
//  }

//  broadcast(`{FFA96C}<b>Гражданин #${player.socialClub} ${text}</b>`, true, 'me')
//})


//registerCMD('do', (player: PlayerMp, args) => {
//  const text = args.join(' ')

//  if (!text) {
//    send(player, 'Используйте <b>/do [текст]</b>', false)
//    return
//  }

//  const formatedText = text.charAt(0).toUpperCase() + text.slice(1)
//  const finalText = formatedText.endsWith('.') ? formatedText : formatedText + '.'

//  broadcast(`{9FFF97}<b>${finalText} (${player.socialClub})</b>`, true, 'do')
//})


//registerCMD('try', (player: PlayerMp, args) => {
//  const text = args.join(' ')
//  const outcomes: Array<'successful' | 'unsuccessful'> = ['successful', 'unsuccessful']
//  const randomOutcome: 'successful' | 'unsuccessful' = outcomes[Math.floor(Math.random() * outcomes.length)]

//  if (!text) {
//    send(player, 'Используйте <b>/try [текст]</b>', false)
//    return
//  }

//  if (randomOutcome === 'successful') {
//    broadcast(`{00FF51}<b>[${player.socialClub}]: ${text} => (Удачно 😄)</b>`, true, 'try')
//  } else {
//    broadcast(`{FF0037}<b>[${player.socialClub}]: ${text} => (Неудачно 😞)</b>`, true, 'try')
//  }
//})


//registerCMD('todo', (player: PlayerMp, args) => {
//  const text = args.join(' ')
//  const parts = text.split('*')
//  const action = parts[0]?.trim()
//  const sayChar = parts[1]?.trim()

//  if (!text) {
//    send(player, 'Используйте <b>/todo [действие персонажа (Что сделав?) * фраза персонажа]</b>', false)
//  } else if (!action) {
//    send(player, 'Не указано действие персонажа! (Вопрос: Что сделав?)', false)
//  } else if (!sayChar) {
//    send(player, 'Не указана фраза вашего персонажа!', false)
//  } else {
//    const formatedAction = action.charAt(0).toUpperCase() + action.slice(1)
//    const formatedSayChar = sayChar.charAt(0).toUpperCase() + sayChar.slice(1)
//    broadcast(`<b>${formatedAction}, ${player.socialClub} сказал: "${formatedSayChar}"</b>`, true, 'todo')
//  }
//})


//registerCMD('testadmin', (player: PlayerMp, args) => {
//  const text = args.join(' ')
//  send(player, `<b>${text}</b>`, true, 'admin')
//})