import * as fs from 'fs'
import * as path from 'path'

import { registerCMD } from '../menus/chat'
import { send } from '../menus/chat'
import { rce } from '../utils/rce'

registerCMD('getpos', (player: PlayerMp, [target, ...namePos]: [string, ...string[]]) => {
    const targetId = parseInt(target, 10)
    const fullNamePos = namePos.join(' ');

    const foundTarget = mp.players.at(targetId)
    const filePath = 'E:/PROJECTS/REDSTAR-RAGE/A • targetPosition.txt'
    
    if (!target || !namePos.length) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    } else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }

    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x}, ${foundTarget.position.y}, ${foundTarget.position.z} || ${foundTarget.rotation.x}, ${foundTarget.rotation.y}, ${foundTarget.rotation.z * (180 / Math.PI)}\n [JSON]: { "x": ${foundTarget.position.x}, "y": ${foundTarget.position.y}, "z": ${foundTarget.position.z}, "rot": ${foundTarget.rotation.z * (180 / Math.PI)} }\n`;
    
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.appendFile(filePath, locationTarget, (err) => {
        if (err) {
            send(player, `{ff3030}<b>Ошибка при записи позиции игрока!</b> (${err})`, false);
        } else {
            send(player, `{0eeb15}Позиция <b>Игрока #${target} успешно записана!</b>`, true, 'admin');
        }
    });
});

registerCMD('setdim', (player: PlayerMp, [target, dimension]: [string, number]) => {
  const targetId = parseInt(target, 10)
  const foundTarget = mp.players.at(targetId)

  if (!target || !dimension) {
    send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
    return;
  } else if (!foundTarget) {
    send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin')
    return
  }

  foundTarget.dimension = dimension
})

registerCMD('veh', (player: PlayerMp, [target, model, r, g, b, numberPlate]) => {
  try {
    // Проверка обязательных аргументов
    if (model === undefined || target === undefined) {
      send(player, `<b>Используйте /veh [playerID] [model] [r?] [g?] [b?] [numberPlate?]</b>`, false, 'admin')
      return
    }

    // Поиск целевого игрока
    const targetPlayer = mp.players.at(parseInt(target, 10))
    if (!targetPlayer) {
      send(player, `<b>Игрок #${target} не найден!</b>`, false, 'admin')
      return
    }

    // Получаем позицию и поворот игрока
    const { position, heading, dimension } = targetPlayer
    
    // Создаем транспорт
    const vehicle = mp.vehicles.new(mp.joaat(model), new mp.Vector3(
      position.x,
      position.y,
      position.z + 1.0  // +1.0 чтобы не спавнить под землей
    ), {
      engine: true,
      color: [
        [r || 255, g || 255, b || 255],  // Первичный цвет (по умолчанию белый)
        [r || 255, g || 255, b || 255]   // Вторичный цвет
      ],
      numberPlate: numberPlate || 'ADMIN',
      dimension: dimension,
      heading: heading  // Используем heading вместо rotation.z
    })

    // Помещаем игрока в транспорт
    targetPlayer.putIntoVehicle(vehicle, 0)

  } catch (e) {
    console.error(`Ошибка при создании транспорта: ${e}`)
    send(player, `<b>Ошибка при создании транспорта: ${e.message}</b>`, false, 'admin')
  }
})

registerCMD('banvoice', (player: PlayerMp, [target]) => {
  if (target === undefined) {
    return send(player, `<b>Используйте /banvoice [playerID]`, false, 'admin')
  }

  // if (target.getVariable('player_mute')) {
  //   return send(player, `<b>Игроку уже выдан бан-войс!</b>`, false, 'admin')
  // }

  const targetPlayer = mp.players.at(parseInt(target, 10))
  rce.triggerClient(targetPlayer, 'player:mute', true)
  send(targetPlayer, `<b>Вам выдан бан-войс!</b>`, true)
})

registerCMD('unbanvoice', (player: PlayerMp, [target]) => {
  if (target === undefined) {
    return send(player, `<b>Используйте /unbanvoice [playerID]</b>`, false, 'admin')
  }

  // if (!target.getVariable('player_mute')) {
  //   return send(player, `<b>У игрока нет бан-войса!</b>`, false, 'admin')
  // }

  const targetPlayer = mp.players.at(parseInt(target, 10))
  rce.triggerClient(targetPlayer, 'player:mute', false)
  send(targetPlayer, `<b>С вас снят бан-войс!</b>`, true)
})