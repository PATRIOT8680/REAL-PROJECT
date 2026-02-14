import { gui } from "../global";
import { rce } from "../../utils/rce";
import Keys from "../../utils/keys";

let inventoryVisible: boolean = false

const showInventory = async (tradeOpen?: boolean) => {
  inventoryVisible = true
  const haveDonatSlots = await rce.callServer('existenceDonatSlots')
  const health = mp.players.local.getHealth()

  gui.execute(`window.App.playerInfoReducer.setHealth(${health})`)
  gui.execute(`window.App.inventoryReducer.showInventory(${haveDonatSlots}, ${tradeOpen})`)
  gui.execute(`window.App.hudReducer.hideHud()`)
  gui.execute(`window.App.chatReducer.hideChat()`)

  mp.game.ui.displayRadar(false)
  mp.gui.cursor.visible = true
}

const hideInventory = () => {
  inventoryVisible = false

  rce.triggerCef('fadeCloseInventory')

  setTimeout(() => {
    gui.execute(`window.App.inventoryReducer.hideInventory()`)
    gui.execute(`window.App.hudReducer.showHud()`)
    gui.execute(`window.App.chatReducer.showChat()`)

    mp.game.ui.displayRadar(true)
    mp.gui.cursor.visible = false
  }, 500)
}

mp.keys.bind(Keys.VK_TAB, false, async () => {
  if (!inventoryVisible) {
    const openedMenus = await rce.callCef('getOpenMenus')
    const specialMenus = ['Welcome', 'Auth', 'SelectChar', 'Spawn', 'CreateChar', 'Loading', 'Rent']
    const hasSpecialOpen = openedMenus.some(menu => specialMenus.includes(menu))

    if (!hasSpecialOpen) {
      showInventory()
    }
  } else {
    hideInventory()
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (inventoryVisible) {
    hideInventory()
  }
})

rce.registerAll('showInventory', (tradeOpen?: boolean) => {
  showInventory(tradeOpen)
})

rce.registerAll('hideInventory', () => {
  hideInventory()
})

// Колесо оружия
mp.events.add('render', () => {
  mp.game.controls.disableControlAction(0, 12, true)
  mp.game.controls.disableControlAction(0, 14, true)
  mp.game.controls.disableControlAction(0, 15, true)
  mp.game.controls.disableControlAction(0, 16, true)
  mp.game.controls.disableControlAction(0, 17, true)
  mp.game.controls.disableControlAction(0, 37, true)
  mp.game.controls.disableControlAction(0, 53, true)
  mp.game.controls.disableControlAction(0, 54, true)
  mp.game.controls.disableControlAction(0, 56, true)
  mp.game.controls.disableControlAction(0, 99, true)
  mp.game.controls.disableControlAction(0, 115, true)
  mp.game.controls.disableControlAction(0, 116, true)
  mp.game.controls.disableControlAction(0, 157, true)
  mp.game.controls.disableControlAction(0, 158, true)
  mp.game.controls.disableControlAction(0, 159, true)
  mp.game.controls.disableControlAction(0, 160, true)
  mp.game.controls.disableControlAction(0, 161, true)
  mp.game.controls.disableControlAction(0, 162, true)
  mp.game.controls.disableControlAction(0, 163, true)
  mp.game.controls.disableControlAction(0, 164, true)
  mp.game.controls.disableControlAction(0, 165, true)
  mp.game.controls.disableControlAction(0, 261, true)
  mp.game.controls.disableControlAction(0, 262, true)
  mp.game.controls.disableControlAction(0, 100, true)
})