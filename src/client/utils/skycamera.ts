import { rce } from "./rce";
import { gui } from '../menus/global'

const Natives = {
  SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
  SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
  IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
};

rce.registerAll('moveSkyCamera', (moveTo, switchType) => {
  const localplayer = mp.players.local

  mp.console.logInfo(`Sky camera: ${localplayer.handle}, ${moveTo}, ${switchType}`)
  switch (moveTo) {
    case 'up':
      mp.console.logInfo('Up')
      mp.game.invoke(Natives.SWITCH_OUT_PLAYER, localplayer.handle, 0, parseInt(switchType));
      break;
    case 'down':
      mp.console.logInfo('Down')
      if (gui.browser.active = false) {
        checkCamInAir();
      };
      mp.game.invoke(Natives.SWITCH_IN_PLAYER, localplayer.handle);
      break;
   
    default:
      break;
   }
})

const checkCamInAir = () => {
  if (mp.game.invoke(Natives.IS_PLAYER_SWITCH_IN_PROGRESS)) {
    setTimeout(() => {
      checkCamInAir()
    }, 400);
  }
}