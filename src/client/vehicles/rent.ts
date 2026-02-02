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

rce.registerServer('closeRent', () => {
  handleHideRent()
})

const handleShowRent = () => {
  mp.gui.cursor.show(true, true)
  gui.execute(`window.App.rentReducer.showRent(${JSON.stringify(rentData)})`)
}

const handleHideRent = () => {
  mp.game.ui.setPauseMenuActive(false)
  mp.gui.cursor.show(false, false)
  gui.execute(`window.App.rentReducer.hideRent()`)

  setTimeout(() => {
    mp.game.ui.setPauseMenuActive(true)
  }, 300)
}

mp.keys.bind(Keys.VK_E, false, () => {
  if (keyDownE !== 'disabled') {
    handleShowRent()
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  handleHideRent()
})