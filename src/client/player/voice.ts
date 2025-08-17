import Keys from '../utils/keys'
import { rpc } from '../utils/rpc'

interface IVoiceManager {
  list: PlayerMp[],
  new: (player: PlayerMp) => void,
  delete: (player: PlayerMp, removedVoice: boolean) => void
}

const voice3d = true
const autovolume = false
const maxDist = 10.0
let mutePlayer = false

mp.keys.bind(Keys.VK_B, true, () => {
  const testMsg = `chatOpened: ${global.chatOpened} & loginPlayer: ${global.loginPlayer}`
  rpc.callServer('cef:serverCmd', [testMsg.toString()])
  if (global.chatOpened || !global.loginPlayer) return
  if (mutePlayer) return rpc.call('chat:pushLine', ['{FF2701}<b>У вас бан-войс!</b>'])

  mp.voiceChat.muted = false
  rpc.call('execute', ['window.voiceComponent.enable()'])
})

mp.keys.bind(Keys.VK_B, false, () => {
  mp.voiceChat.muted = true
  rpc.call('execute', ['window.voiceComponent.disable()'])
})

mp.keys.bind(Keys.VK_F10, false, () => {
  mp.voiceChat.muted = true
  setTimeout(() => {
    if (!mp.voiceChat.muted) return
    else {
      mp.voiceChat.cleanupAndReload(true, true, true)
      rpc.call('execute', [`window.App.sendNotifyReducer.sendNotify('success', 'Войс-чат был успешно перезагружен!', 3000, 'bottom')`])
    }
  }, 100)
})

let voiceManager: IVoiceManager = {
  list: [],

  new(player: any)  {
    if (this.list.indexOf(player) === -1) {
      mp.events.callRemote('client:voice:new', player)
      this.list.push(player)
      player.isListening = true

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

  delete(player: any, removedVoice: boolean) {
    let index = this.list.indexOf(player)

    if (index !== -1) {
      this.list.splice(index, 1)
    }

    player.isListening = false

    if (removedVoice) {
      mp.events.callRemote('client:voice:deleted', player)
    }
  }
}

mp.events.add('playerQuit', (player: any) => {
  if(player.isListening)
	{
		voiceManager.delete(player, false)
	}
})

rpc.register('switchVoice', (state: boolean) => {
  mutePlayer = state
  mp.voiceChat.muted = state

  if (mutePlayer) {
    rpc.call('execute', ['window.voiceComponent.disabled()'])
  } else {
    rpc.call('execute', ['window.voiceComponent.enabled()'])
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