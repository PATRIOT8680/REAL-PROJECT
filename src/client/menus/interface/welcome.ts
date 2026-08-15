import { rce } from '../../utils/rce'
import { gui } from '../global'

mp.events.add('browserDomReady', async (player: PlayerMp) => {
  const { existing, haveRequest } = await rce.callServer('checkWhitelist')

  if (existing) {
    gui.execute('window.App.welcomeReducer.showWelcome()')
    mp.gui.cursor.visible = true

    setTimeout(() => {
      rce.trigger('cef:authEnabled')

      setTimeout(() => {
        gui.execute('window.App.welcomeReducer.hideWelcome()')
      }, 200)
    }, 5100)
  } else {
    mp.cameras.new('default',
      new mp.Vector3(-1391.9077, 2417.4196, 58.210),
      new mp.Vector3(0, 0, 150.2362), 45
    )
    mp.game.ui.displayRadar(false)
    mp.gui.cursor.visible = true
    rce.triggerServer('setPosChar', -1487.7098, 2274.3295, 32.5487, 153.0708)
    mp.game.cam.renderScriptCams(true, false, 0, true, false)
    gui.execute(`window.App.whitelistReducer.showWhitelist(${haveRequest})`)
  }
})