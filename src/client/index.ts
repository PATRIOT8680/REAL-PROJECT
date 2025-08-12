import { openInterfaces } from './menus/main/toogleInterface'

import './menus/global'
//import './admin/noclip.js'
//import './player/toogleAnim'
import './utils/keys'
import './utils/rpc'
import './game/movingCamera'
import './player/death'
import './player/events'
import './player/connected'
import './player/gametag'

if (openInterfaces.has('Auth')) {
	mp.console.logInfo('Меню авторизации ВКЛЮЧЕНО!')
} else {
	mp.console.logInfo('Меню авторизации ОТКЛЮЧЕНО!')
}