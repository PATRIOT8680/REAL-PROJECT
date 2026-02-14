import Keys from '../utils/keys'
import { rce } from '../utils/rce'
import { gui } from '../menus/global'

interface IVoiceManager {
  list: PlayerMp[],
  new: (player: PlayerMp) => void,
  delete: (player: PlayerMp, removedVoice: boolean) => void
}

const voice3d = true
const autovolume = false
const maxDist = 10.0

rce.registerAll('mutePlayer', (toogle: boolean) => {
  global.mutePlayer = toogle
})

mp.keys.bind(Keys.VK_B, true, () => {
  if (global.chatOpened || !global.loginPlayer) return
  if (mp.players.local.getVariable('player_mute')) return rce.trigger('chat:pushLine', '{FF2701}<b>У вас бан-войс!</b>')

  mp.voiceChat.muted = false
  global.activeVoice = true
  mp.players.local.playFacialAnim("mic_chatter", "mp_facial");
  gui.execute('window.voiceComponent.enable()')
})

mp.keys.bind(Keys.VK_B, false, () => {
  mp.voiceChat.muted = true
  global.activeVoice = false
  mp.players.local.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
  gui.execute('window.voiceComponent.disable()')
})

mp.keys.bind(Keys.VK_F10, false, () => {
  mp.voiceChat.muted = true
  setTimeout(() => {
    if (!mp.voiceChat.muted) return
    else {
      mp.voiceChat.cleanupAndReload(true, true, true)
      gui.execute(`window.App.sendNotifyReducer.sendNotify('success', 'Войс-чат был успешно перезагружен!', 3000, 'bottom')`)
    }
  }, 100)
})

let voiceManager: IVoiceManager = {
  list: [],

  new(player: PlayerMp)  {
    if (this.list.indexOf(player) === -1) {
      rce.triggerServer('client:voice:new', player.remoteId)
      this.list.push(player)

      if (autovolume) {
        player.voiceAutoVolume = true
      } else {
        player.voiceVolume = 1.0
      }

      if (voice3d) {
        player.voice3d = true
      }
    }
  },

  delete(player: PlayerMp, removedVoice: boolean) {
    let index = this.list.indexOf(player)

    if (index !== -1) {
      this.list.splice(index, 1)
    }

    if (removedVoice) {
      rce.triggerServer('client:voice:deleted', player.remoteId)
    }
  }
}

mp.events.add('playerQuit', (player: any) => {
  if(player.isListening)
	{
		voiceManager.delete(player, false)
	}
})

mp.events.add('playerStartTalking', (player) =>
{
    if (!player || !mp.players.exists(player) || player.type !== 'player') return;
    player.playFacialAnim("mic_chatter", "mp_facial");
});

mp.events.add('playerStopTalking', (player) =>
{
    if (!player || !mp.players.exists(player) || player.type !== 'player') return;
    player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
});

rce.registerServer('player:mute', (state: boolean) => {
  rce.triggerServer('player:mute', state)
  mp.voiceChat.muted = true

  if (state) {
    gui.execute('window.voiceComponent.disabled()')
  } else {
    gui.execute('window.voiceComponent.enabled()')
  }
})

setInterval(() => {
  let localplayer = mp.players.local
  let localPos = localplayer.position

  mp.players.forEachInStreamRange((player: any) => {
    if (player !== localplayer && !player.isListening) {
      const playerPos = player.position
      let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z)

      if (dist <= maxDist) {
        mp.console.logWarning(`${voiceManager.list}`)
        voiceManager.new(player)
      }
    }
  })

  voiceManager.list.forEach((player: PlayerMp) => {
    if (player.handle !== 0) {
      const playerPos = player.position
      let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z)

      if (dist > maxDist) {
        voiceManager.delete(player, true)
      } else if (!autovolume) {
        player.voiceVolume = 1.0 - (dist / maxDist)
      }
    } else {
      voiceManager.delete(player, true)
    }
  })
}, 500)