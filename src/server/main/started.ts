import { initTimeSystem } from "../world/time";

mp.events.add('packagesLoaded', () => {
  initTimeSystem()
})