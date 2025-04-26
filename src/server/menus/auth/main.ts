import { rpc } from '../../utils/rpc'

import { registerUser } from './register';
import { loginUser } from './login';
import { changePassRecovery, sendRecoveryCode } from './recovery';

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

rpc.register('client:authPlayerVisible', (player: PlayerMp, visible: boolean) => {
	if (visible === false) {
    player.alpha = 0
  } else {
    player.alpha = 255
  }
})


rpc.register('client:startNewCamera', (player: PlayerMp, coords: IPlayerCoords) => {
  player.position = new mp.Vector3(coords.x, coords.y, coords.z)
})


rpc.register('cef:auth:regAccount', (player: PlayerMp, login: string, email: string, password: string) => {
  registerUser(player, login, email, password)
})

rpc.register('cef:auth:loginAccount', (player: PlayerMp, login: string, password: string) => {
  loginUser(player, login, password)
})

rpc.register('cef:auth:sendRecoveryCode', (player: PlayerMp, email: string) => {
  sendRecoveryCode(player, email)
})

rpc.register('cef:auth:changePassRecovery', (player: PlayerMp, email: string, code: string, newPass: string) => {
  changePassRecovery(player, email, code, newPass)
})