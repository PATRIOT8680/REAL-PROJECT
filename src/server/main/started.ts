import { initTimeSystem } from "../world/time";
import { initItems } from "../modules/inventory/items";
import { rce } from "../utils/rce";

mp.events.add('packagesLoaded', () => {
  initTimeSystem()
  initItems()
})