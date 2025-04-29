import { rpc } from '../../utils/rpc'

mp.events.add('browserDomReady', async (player) => {
  rpc.call('execute', [`window.App.welcomeReducer.showWelcome()`])

  await setTimeout(() => {
    rpc.call('cef:authEnabled', [])

    setTimeout(() => {
      rpc.call('execute', [`window.App.welcomeReducer.hideWelcome()`])
    }, 200)
  }, 7100)
})