import Keys from '../utils/keys'
import { rpc } from '../utils/rpc'

interface IVoiceManager {
  list: PlayerMp[],
  new: (player: PlayerMp) => void,
  delete: (player: PlayerMp, removedVoice: boolean) => void
}

const voice3d = true
const autovolume = false
const maxDist = 7
let mutePlayer = false

mp.keys.bind(Keys.VK_B, true, () => {
  mp.console.logInfo(`chatOpened: ${global.chatOpened} & loginPlayer: ${global.loginPlayer}`)
  if (global.chatOpened || !global.loginPlayer) return
  if (mutePlayer) return rpc.call('pushLine', ['{FF2701}<b>У вас бан-войс!</b>'])

  mp.voiceChat.muted = false
  mp.console.logWarning('Войс включен')
  rpc.call('execute', ['window.voiceComponent.enable()'])
})

mp.keys.bind(Keys.VK_B, false, () => {
  mp.voiceChat.muted = true
  mp.console.logWarning('Войс выключен')
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

  new(player: PlayerMp)  {
    if (this.list.indexOf(player) !== -1) {
      rpc.callServer('client:voice:new', [player])
      this.list.push(player)

      if (autovolume) {
        player.voiceAutoVolume = true
      } else {
        player.voiceVolume = 1
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
      rpc.callServer('client:voice:delete', [player])
    }
  }
}

mp.events.add('playerQuit', (player: PlayerMp) => {
  voiceManager.delete(player, false)
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

  mp.players.forEachInStreamRange((player: PlayerMp) => {
    if (player !== localplayer) {
      const playerPos = player.position
      let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z)

      if (dist <= maxDist) {
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
        player.voiceVolume = 1 - (dist / maxDist)
      }
    } else {
      voiceManager.delete(player, true)
    }
  })
}, 500)