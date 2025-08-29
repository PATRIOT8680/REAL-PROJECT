import { rce } from "../../utils/rce";

const scenarios = [
  "WORLD_HUMAN_AA_COFFEE",
  "WORLD_HUMAN_CAR_PARK_ATTENDANT",
  "WORLD_HUMAN_CLIPBOARD_FACILITY",
  "WORLD_HUMAN_COP_IDLES",
  "WORLD_HUMAN_DRINKING_FACILITY",
  "WORLD_HUMAN_GUARD_STAND",
  "WORLD_HUMAN_STAND_MOBILE",
  "EAR_TO_TEXT_FAT",
  "WORLD_HUMAN_AA_SMOKE",
]


rce.registerServer('server:showSelectChar', () => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  mp.players.local.taskStartScenarioInPlace(scenario, 0, false)
})