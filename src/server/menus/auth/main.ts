import { rce } from '../../utils/rce'

import { checkUser } from './register';
import { loginUser } from './login';
import { changePassRecovery, sendRecoveryCode } from './recovery';
import { sendCodeVerify, verifyEmail } from './verify-email';

export interface User {
  login: string
  email: string
  password: string
  socialClubName: string,
  sid: number
}

interface IPlayerCoords {
    x: number;
    y: number;
    z: number;
}

rce.registerClient('client:authPlayerVisible', (player: PlayerMp, visible: boolean) => {
  console.log('Закрываем авторизацию')
	if (visible === false) {
    player.alpha = 0
  } else {
    player.alpha = 255
  }
})


rce.registerClient('client:startNewCamera', (player: PlayerMp, coords: IPlayerCoords) => {
  player.position = new mp.Vector3(coords.x, coords.y, coords.z)
})

rce.registerCef('cef:auth:regAccount', (player: PlayerMp, login: string, email: string, password: string) => {
  checkUser(player, login, email, password)
})


rce.registerCef('cef:auth:verifyEmail', (player: PlayerMp, code: string, login: string, email: string, password: string) => {
  verifyEmail(player, code, login, email, password)
})

rce.registerCef('cef:auth:sendCodeVerify', (player: PlayerMp, email: string) => {
  sendCodeVerify(player, email)
})


rce.registerCef('cef:auth:loginAccount', (player: PlayerMp, login: string, password: string) => {
  loginUser(player, login, password)
})


rce.registerCef('cef:auth:sendRecoveryCode', (player: PlayerMp, email: string) => {
  sendRecoveryCode(player, email)
})

rce.registerCef('cef:auth:changePassRecovery', (player: PlayerMp, email: string, code: string, newPass: string) => {
  changePassRecovery(player, email, code, newPass)
})