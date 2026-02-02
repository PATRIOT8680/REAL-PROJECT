export interface ServerItem {
  id: number;
  name: string;
  description: string;
  imageId: number;
  maxStack: number;
  type: string;
  weight: number;
  stackable: boolean;
  consumable: boolean;
  price?: number,
  hashObj?: string,
  usage?: (player: PlayerMp) => void,

  clothesData?: {
    type: 'clothes' | 'props',
    gender: 'male' | 'female',
    sectionId: number,
    drawable: number,
    texture: number,
    slot: number,
    maxWeight?: number,
    propId?: number,
  },

  weaponData?: {
    ammoType?: string,
  },

  foodData?: {
    healthRestore?: number,
    eatRestore?: number,
    waterRestore?: number,
    waitingUsage?: number,
    anim?: { dict: string, name: string, flag: number }
  },
}