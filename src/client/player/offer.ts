import { rce } from "../utils/rce";
import { gui } from "../menus/global";
import Keys from '../utils/keys'

let ev = null

rce.registerServer('showOffer', (senderId: number, title: string, description: string, duration: number) => {
  const playerSender = mp.players.at(senderId)
  if (!playerSender) return

  const lcplayer = mp.players.local
  const distToSender = mp.game.system.vdist(
    lcplayer.position.x, lcplayer.position.y, lcplayer.position.z,
    playerSender.position.x, playerSender.position.y, playerSender.position.z
  )

  gui.execute(`window.App.offerReducer.showOffer('${title}', '${description}', ${duration})`)

  return new Promise((resolve: any) => {
    let resolved = false

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true
        resolve('timeout')
        cleanup()
      }
    }, duration)

    const keyHandler = () => {
      if (resolved) {
        cleanup()
        return
      }

      if (mp.keys.isDown(Keys.VK_Y)) {
        if (distToSender > 8) {
          gui.execute(`window.App.sendNotifyReducer.sendNotify('err', 'Игрок не рядом с вами!', 3500, 'bottom')`)
          cleanup()
          return
        }
        clearTimeout(timeoutId)
        resolve(true)
        cleanup()
      }

      if (mp.keys.isDown(Keys.VK_N)) {
        clearTimeout(timeoutId)
        resolve(false)
        cleanup()
      }
    }

    if (ev) {
      resolved = true
      ev.destroy()
    }

    ev = new mp.Event("render", keyHandler)

    const cleanup = () => {
      if (ev) {
        gui.execute(`window.App.offerReducer.hideOffer()`)
        ev.destroy()
        ev = null
      }
    }
  })
})