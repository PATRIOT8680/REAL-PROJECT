import { rce } from "../utils/rce";
import { gui } from "../menus/global";

rce.registerAll('handleActionInteraction', (typeEntity: 'player' | 'vehicle', action: string, targetId: number) => {
  const target = typeEntity === 'player' ? mp.players.at(targetId) : mp.vehicles.at(targetId)
  if (target === undefined) return

  const lcplayer = mp.players.local

  const distToEntity = mp.game.system.vdist(
    lcplayer.position.x, lcplayer.position.y, lcplayer.position.z,
    target.position.x, target.position.y, target.position.z
  )

  if (distToEntity <= 7) {
    if (typeEntity === 'player') {
      rce.triggerServer('handleInteractionPlayer', action, targetId)
    }
  } else {
    gui.execute(`window.App.sendNotifyReducer.sendNotify('err', 'Игрок далеко от вас!', 3000, 'bottom')`)
  }
})