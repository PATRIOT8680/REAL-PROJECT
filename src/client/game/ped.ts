import { rce } from "../utils/rce"
import { playAnim } from "../utils/playAnim"

const scenarios = [
  "WORLD_HUMAN_AA_COFFEE",
  "WORLD_HUMAN_CAR_PARK_ATTENDANT",
  "WORLD_HUMAN_CLIPBOARD_FACILITY",
  "WORLD_HUMAN_COP_IDLES",
  "WORLD_HUMAN_DRINKING_FACILITY",
  "WORLD_HUMAN_GUARD_STAND",
  "WORLD_HUMAN_STAND_MOBILE",
  "EAR_TO_TEXT_FAT",
  "WORLD_LOOKAT_POINT",
  "WORLD_HUMAN_AA_SMOKE",
]

let pedsData = new Map()

mp.events.add('entityStreamIn', (entity: any) => {
  if (entity && entity.handle !== 0 && entity.type === 'ped') {
    const pedData = pedsData.get(entity.id)
    if (pedData && pedData.scenario) {
      entity.taskStartScenarioInPlace(pedData.scenario, 0, false);
    }
  }
})

rce.registerAll('createPed', (pedName: string, pedRole: string, modelName: string, pedPos: Array4d, blip: any) => {
  const [x, y, z, heading] = pedPos

  const npc = mp.peds.new(mp.game.joaat(modelName),
    new mp.Vector3(x, y, z), heading, 0
  )

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]

  pedsData.set(npc.id, {
    scenario: scenario,
    name: pedName,
    role: pedRole
  });

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
      { los: false, font: 4, drawDistance: 3,  color: [21, 255, 146, 190], dimension: 0}
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
        scale: 0.8,
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