import { openInterfaces } from './menus/main/toogleInterface'

import './menus/global'
//import './admin/noclip.js'
//import './player/toogleAnim'
import './menus/interface/loading'
import './utils/keys'
import './utils/rpc'

if (openInterfaces.has('Auth')) {
	mp.console.logInfo('Меню авторизации ВКЛЮЧЕНО!')
} else {
	mp.console.logInfo('Меню авторизации ОТКЛЮЧЕНО!')

}