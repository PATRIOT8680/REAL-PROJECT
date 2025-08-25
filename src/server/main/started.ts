import { initTimeSystem } from "../world/time";
import { rce } from "../utils/rce";

mp.events.add('packagesLoaded', () => {
  initTimeSystem()

})