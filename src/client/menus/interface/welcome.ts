import { rpc } from '../../utils/rpc'

mp.events.add('browserDomReady', async (player: PlayerMp) => {
  rpc.call('execute', [`window.App.welcomeReducer.showWelcome()`])
  mp.gui.cursor.visible = true

  await setTimeout(() => {
    rpc.call('cef:authEnabled', [])

    setTimeout(() => {
      rpc.call('execute', [`window.App.welcomeReducer.hideWelcome()`])
    }, 200)
  }, 7100)
})