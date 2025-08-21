import { rce } from '../utils/rce'

import './chat'
import './auth/main'

rce.registerClientAndCef('cef:serverCmd', (player: PlayerMp, msg: string) => {
  console.log(`[CEF]: ${msg}`)
})

// rce.registerClientAndCef('playerReady', (player: PlayerMp) => {
//   player.call('server:webReady')
// })