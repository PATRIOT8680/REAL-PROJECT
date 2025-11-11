import { rce } from '../utils/rce'
import torsoDataFemale from "../configs/besttorso_female.json";
import torsoDataMale from "../configs/besttorso_male.json";

rce.registerClientCef('getIdPlayer', (player: PlayerMp) => {
  return player.id
})

rce.registerClientCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})

rce.registerClientCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})

rce.registerClientCef('setPosChar', (player: PlayerMp, x, y, z, heading) => {
  player.position = new mp.Vector3(x, y, z)
  player.heading = heading
})

rce.registerClientCef('setSpawnChar', (player: PlayerMp, x, y, z, heading) => {
  player.spawn(new mp.Vector3(x, y, z))
  player.heading = heading
})

rce.registerClientCef('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
  const freemodeModels = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];

  console.log(`[CLOTHES] Received: component=${componentId}, drawable=${drawable}, texture=${texture}`);

  if (!freemodeModels.includes(player.model)) {
    console.log(`[CLOTHES] Player model is not freemode, setting clothes directly`);
    player.setClothes(componentId, drawable, texture, 2);
    return;
  }

  const isMale = player.model === freemodeModels[0];
  const torsoData = isMale ? torsoDataMale : torsoDataFemale;

  console.log(`[CLOTHES] Model: ${isMale ? 'male' : 'female'}`);
  console.log(`[CLOTHES] Checking torsoData[${drawable}][${texture}]:`, torsoData[drawable] ? torsoData[drawable][texture] : 'NOT FOUND');

  if (componentId === 11) {
    console.log(`[CLOTHES] Processing tops component`);
    player.setClothes(8, 15, 0, 2);

    if (torsoData[drawable] && torsoData[drawable][texture]) {
      const torsoInfo = torsoData[drawable][texture];
      console.log(`[CLOTHES] BestTorso data found:`, torsoInfo);

      if (torsoInfo.BestTorsoDrawable !== -1 && torsoInfo.BestTorsoDrawable !== 0) {
        console.log(`[CLOTHES] Setting BestTorso: ${torsoInfo.BestTorsoDrawable}, ${torsoInfo.BestTorsoTexture}`);
        player.setClothes(3, torsoInfo.BestTorsoDrawable, torsoInfo.BestTorsoTexture, 2);
      } else {
        const defaultTorso = isMale ? 15 : 15;
        console.log(`[CLOTHES] Using default torso: ${defaultTorso} (BestTorso was ${torsoInfo.BestTorsoDrawable})`);
        player.setClothes(3, torsoInfo.BestTorsoDrawable, torsoInfo.BestTorsoTexture, 2);
      }

      console.log(`[CLOTHES] Setting top: ${drawable}, ${texture}`);
      player.setClothes(11, drawable, texture, 2);
    } else {
      console.log(`[CLOTHES] No BestTorso data found, using defaults`);
      const defaultTorso = isMale ? 15 : 15;
      player.setClothes(3, defaultTorso, 0, 2);
      player.setClothes(11, drawable, texture, 2);
    }
  } else {
    console.log(`[CLOTHES] Setting non-tops component: ${componentId}`);
    player.setClothes(componentId, drawable, texture, 2);
  }
});