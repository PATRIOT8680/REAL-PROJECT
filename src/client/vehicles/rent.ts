import { rce } from "../utils/rce"
import { gui } from '../menus/global'
import Keys from '../utils/keys'

let keyDownE = 'disabled'
let rentData = null

rce.registerServer('rentColshape', (status, data) => {
  if (status === 'enabled') {
    keyDownE = 'enabled'
    rentData = data
  } else {
    gui.execute(`window.App.rentReducer.hideRent()`)
    mp.gui.cursor.show(false, false)
    keyDownE = 'disabled'
    rentData = null
  }
})

mp.keys.bind(Keys.VK_E, false, () => {
  if (keyDownE !== 'disabled') {
    mp.console.logWarning(`Получили: ${JSON.stringify(rentData)}`)
    mp.gui.cursor.show(true, true)
    gui.execute(`window.App.rentReducer.showRent(${JSON.stringify(rentData)})`)
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  mp.game.ui.setPauseMenuActive(false)
  mp.gui.cursor.show(false, false)
  gui.execute(`window.App.rentReducer.hideRent()`)

  setTimeout(() => {
    mp.game.ui.setPauseMenuActive(true)
  }, 300)
})