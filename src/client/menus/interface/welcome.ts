import { rce } from '../../utils/rce'
import { gui } from '../global'

mp.events.add('browserDomReady', async (player: PlayerMp) => {
  gui.execute('window.App.welcomeReducer.showWelcome()')
  mp.gui.cursor.visible = true

  await setTimeout(() => {
    rce.trigger('cef:authEnabled')

    setTimeout(() => {
      gui.execute('window.App.welcomeReducer.hideWelcome()')
    }, 200)
  }, 7100)
})