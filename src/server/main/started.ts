import { initTimeSystem } from "../world/time";
import { initItems } from "../modules/inventory/items";
import { loadItems } from "../modules/inventory/itemsObject";
import { rce } from "../utils/rce";

mp.events.add('packagesLoaded', () => {
  initTimeSystem()
  initItems()
  loadItems()
})