import { openInterfaces } from './menus/main/toogleInterface'

import './player/nametags'
import './menus/global'
//import './player/toogleAnim'
import './utils/keys'
import './utils/rpc'
import './game/movingCamera'
import './player/death'
import './player/events'
import './player/connected'
import './admin/noclip'

if (openInterfaces.has('Auth')) {
	mp.console.logInfo('Меню авторизации ВКЛЮЧЕНО!')
} else {
	mp.console.logInfo('Меню авторизации ОТКЛЮЧЕНО!')
}