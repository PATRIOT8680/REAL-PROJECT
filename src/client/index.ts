import './player/nametags'
import './menus/global'
import './utils/keys'
import './utils/rce'
import './player/death'
import './player/events'
import './player/connected'
import './admin/noclip'
import './player/voice'
import './utils/dist'
import './game/ped'
import './vehicles/rent'
import './menus/interface/select-char'
import './utils/skycamera'
import './utils/getGroundZ'
import './player/sync'
import './utils/playAnim'
import './game/items'
import './vehicles/speed'
// import './game/locations'
import './utils/discord'
import './entity/interaction'
import './player/offer'
import './vehicles/interaction'
import './player/interaction'

mp.game.invoke("0x6E9EF3A33C8899F8", true)
mp.game.invoke("0x4CC7F0FEA5283FE0", true)
mp.game.invoke("0xAEEDAD1420C65CC0", true)

mp.events.add('render', () => {
  mp.game.ui.hideHudComponentThisFrame(3)
  mp.game.ui.hideHudComponentThisFrame(4)
  mp.game.ui.hideHudComponentThisFrame(6)
  mp.game.ui.hideHudComponentThisFrame(7)
  mp.game.ui.hideHudComponentThisFrame(9)
})