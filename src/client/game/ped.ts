import { rce } from "../utils/rce"

rce.registerAll('createPed', (pedName: string, pedRole: string, modelName: string, pedPos: Array4d, blip: any) => {
  const [x, y, z, heading] = pedPos

  let ped = mp.peds.new(mp.game.joaat(modelName),
    new mp.Vector3(x, y, z), heading, 0
  )

  const timer = setInterval(() => {
    if (mp.game.streaming.hasAnimDictLoaded("amb@code_human_wander_smoking@male@idle_a")) {
      clearInterval(timer);
      ped.taskPlayAnim("amb@code_human_wander_smoking@male@idle_a", "idle_b", 8.0, 1.0,
          -1, 1, 1.0, false, false, false);
    }
  }, 200)

  //mp.players.local.taskStartScenarioInPlace('WORLD_HUMAN_CONST_DRILL', 0, false);
  //mp.game.task.startScenarioInPlace(mp.game.joaat(modelName), "WORLD_HUMAN_AA_COFFEE", 0, false)
  //ped.taskStartScenarioInPlace("WORLD_HUMAN_AA_COFFEE", 0, false)

  mp.labels.new(
    pedName, new mp.Vector3(x, y, z + 1.2),
    { los: false, font: 4, drawDistance: 7.5,  color: [255, 255, 255, 255], dimension: 0 }
  )
  mp.labels.new(
    pedRole, new mp.Vector3(x, y, z + 1.05),
    { los: false, font: 4, drawDistance: 7.5,  color: [255, 102, 37, 255], dimension: 0}
  )
  mp.labels.new(
      '[E]', new mp.Vector3(x, y, z + 0.2),
      { los: false, font: 4, drawDistance: 5,  color: [21, 255, 146, 190], dimension: 0}
  )

  mp.markers.new(23, new mp.Vector3(x, y, z - 0.95), 1,
      {
        direction: new mp.Vector3(x, y, z),
        rotation: new mp.Vector3(0, 0, 0),
        color: [255, 255, 255, 255],
        dimension: 0,
        visible: true
      }
  )


  if (blip.isVisible) {
    mp.blips.new(blip.id, new mp.Vector3(x, y, z),
      {
        name: pedRole,
        scale: 1,
        color: blip.color,
        alpha: 255,
        drawDistance: 100,
        shortRange: true,
        rotation: 0,
        dimension: 0
      }
    )
  }
})