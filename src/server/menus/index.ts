import { rpc } from '../utils/rpc'

import './chat'
import './auth/main'

rpc.register('cef:serverCmd', (msg: string) => {
  console.log(`[CEF]: ${msg}`)
})

mp.events.add('playerReady', (player: PlayerMp) => {
  player.call('server:webReady')
})