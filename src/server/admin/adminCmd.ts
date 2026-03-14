import * as fs from 'fs'
import * as path from 'path'

import { registerCMD } from '../menus/chat'
import { registerACommand } from "./console"
import { send } from '../menus/chat'
import { rce } from '../utils/rce'
import {data} from "../database/mysql";
import chalk from "chalk";
import { setDataAccount } from "../data/setDataAccount";
import { playerReborn, playerKnockout } from "../player/death";

registerCMD('getpos', (player: PlayerMp, [target, ...namePos]: [string, ...string[]]) => {
    const targetId = parseInt(target, 10)
    const fullNamePos = namePos.join(' ');

    const foundTarget = mp.players.at(targetId)
    const filePath = 'D:/PROJECTS/REAL-RP/A • targetPosition.txt'
    
    if (!target || !namePos.length) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    } else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }

    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x.toFixed(4)}, ${foundTarget.position.y.toFixed(4)}, ${foundTarget.position.z.toFixed(4)} [${foundTarget.heading.toFixed(4)}]\n [JSON]: { "x": ${foundTarget.position.x.toFixed(4)}, "y": ${foundTarget.position.y.toFixed(4)}, "z": ${foundTarget.position.z.toFixed(4)}, "rot": ${foundTarget.heading.toFixed(4)} }\n`;
    
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

registerACommand(
    'sethp',
    'Установить здоровье игроку',
    [
      { name: 'id игрока', type: 'number' },
      { name: 'hp', type: 'number' }
    ], 1,
    (player: PlayerMp, [targetId, hp]) => {
      const targetIdNum = parseInt(targetId)
      const hpNum = parseInt(hp)

      if (!targetId || !hp) {
        rce.triggerCef(player, 'console:commandResponse', false, 'Используйте: sethp [ID игрока] [hp]')
        return
      }

      const target = mp.players.at(targetIdNum)
      if (!target) {
        rce.triggerCef(player, 'console:commandResponse', false, `Игрок с ID:${targetId} не найден!`)
        return
      }

      if (hpNum < 0 || hpNum > 100) {
        rce.triggerCef(player, 'console:commandResponse', false, `HP должно быть от 0 до 100!`)
        return
      }

      target.health = parseInt(hp)
      rce.triggerClient(target, 'sendNotify', 'info', `Вам установлено HP: ${hp}%`, 3500, 'bottom')
      rce.triggerCef(player, 'console:commandResponse', false, `Игроку ID:${targetId} выдано HP: ${hp}%`)
    }
)

registerACommand(
    'banvoice',
    'Выдать мут игроку',
    [
      { name: 'id игрока', type: 'number' },
    ], 2,
    (player: PlayerMp, [targetId]) => {
      const targetIdNum = parseInt(targetId)

      if (!targetId) {
        rce.triggerCef(player, 'console:commandResponse', false, 'Используйте: banvoice [ID игрока]')
        return
      }

      const target = mp.players.at(targetIdNum)
      if (!target) {
        rce.triggerCef(player, 'console:commandResponse', false, `Игрок с ID:${targetId} не найден!`)
        return
      }

      target.setVariable('player_mute', true)
      rce.triggerClient(target, 'sendNotify', 'err', `Вам выдан бан-войс!`, 3500, 'bottom')
      rce.triggerCef(player, 'console:commandResponse', false, `Игроку ID:${targetId} установлен бан-войс`)
    }
)

registerACommand(
    'unbanvoice',
    'Снять мут с игрока',
    [
      { name: 'id игрока', type: 'number' },
    ], 2,
    (player: PlayerMp, [targetId]) => {
      const targetIdNum = parseInt(targetId)

      if (!targetId) {
        rce.triggerCef(player, 'console:commandResponse', false, 'Используйте: unbanvoice [ID игрока]')
        return
      }

      const target = mp.players.at(targetIdNum)
      if (!target) {
        rce.triggerCef(player, 'console:commandResponse', false, `Игрок с ID:${targetId} не найден!`)
        return
      }

      target.setVariable('player_mute', false)
      rce.triggerClient(target, 'sendNotify', 'success', `С вас снят бан-войс!`, 3500, 'bottom')
      rce.triggerCef(player, 'console:commandResponse', false, `С игрока ID:${targetId} снят бан-войс`)
    }
)

registerACommand(
    'knockout',
    'Нокаутировать игрока',
    [
      { name: 'id игрока', type: 'number' },
    ], 1,
    (player: PlayerMp, [targetId]) => {
      const targetIdNum = parseInt(targetId)

      if (!targetId) {
        rce.triggerCef(player, 'console:commandResponse', false, 'Используйте: knockout [ID игрока]')
        return
      }

      const target = mp.players.at(targetIdNum)
      if (!target) {
        rce.triggerCef(player, 'console:commandResponse', false, `Игрок с ID:${targetId} не найден!`)
        return
      }

      playerKnockout(target)
      rce.triggerClient(player, 'console:commandResponse', false, `Игрок ID:${targetId} нокаутирован`)
    }
)

registerACommand(
    'reborn',
    'Воскресить игрока',
    [
      { name: 'id игрока', type: 'number' },
    ], 1,
    (player: PlayerMp, [targetId]) => {
      const targetIdNum = parseInt(targetId)

      if (!targetId) {
        rce.triggerCef(player, 'console:commandResponse', false, 'Используйте: reborn [ID игрока]')
        return
      }

      const target = mp.players.at(targetIdNum)
      if (!target) {
        rce.triggerCef(player, 'console:commandResponse', false, `Игрок с ID:${targetId} не найден!`)
        return
      }

      playerReborn(target)
      rce.triggerClient(player, 'console:commandResponse', false, `Игрок ID:${targetId} воскрешен`)
    }
)

registerACommand(
    'getmepos',
    'Получить свои координаты',
    [], 7,
    (player: PlayerMp) => {
      const pos = player.position
      const heading = player.heading

      rce.triggerCef(player, 'console:commandResponse', false, `${pos.x.toFixed(4)}, ${pos.y.toFixed(4)}, ${pos.z.toFixed(4)}, ${heading.toFixed(4)}`)
    }
)

registerACommand(
  'newrent',
  'Открыть меню для создания аренды',
  [], 10,

  (player: PlayerMp) => {
    rce.triggerClient(player, 'closeAMenu')
    rce.triggerClient(player, 'execute', 'window.App.devMenusReducer.showNewRent()')
  }
)

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


registerCMD('allclearchat', (player: PlayerMp) => {
  rce.triggerClients('clearChat')
  mp.players.forEach(p => {
    send(p, '<b>Чат был очищен у всех!</b>', false, 'ADMIN')
  })
})

registerCMD('setdim', (player: PlayerMp, [targetID, dimension]) => {
  if (!targetID || !dimension)
    return send(player, '<b>Используйте /setdim [ID игрока] [dimension]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)
  target.dimension = Number(dimension)

  rce.triggerClient(target, 'sendNotify', 'info', `Вам установлен dimension #${dimension}!`, 4000, 'bottom')
  rce.triggerClient(player, 'sendNotify', 'info', `Игроку (ID: ${targetID}) установлен dimension #${dimension}!`, 3000, 'top')
})


registerCMD('addcash', async (player: PlayerMp, [targetID, amount]) => {
  if (!targetID || !amount)
    return send(player, '<b>Используйте /addcash [ID игрока] [кол-во]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)
  await setDataAccount(target, 'addCash', Number(amount), targetID)
})

registerCMD('decrementcash', (player: PlayerMp, [targetID, amount]) => {
  if (!targetID || !amount)
    return send(player, '<b>Используйте /decrementcash [ID игрока] [кол-во]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)
  setDataAccount(target, 'decrementCash', Number(amount), targetID)
})

registerCMD('addbankmoney', (player: PlayerMp, [targetID, amount]) => {
  if (!targetID || !amount)
    return send(player, '<b>Используйте /addbankmoney [ID игрока] [кол-во]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)
  setDataAccount(target, 'addBankMoney', Number(amount), targetID)
})

registerCMD('decrementbankmoney', (player: PlayerMp, [targetID, amount]) => {
  if (!targetID || !amount)
    return send(player, '<b>Используйте /decrementbankmoney [ID игрока] [кол-во]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)
  setDataAccount(target, 'decrementbankmoney', Number(amount), targetID)
})

registerCMD('tpto', (player: PlayerMp, [targetID]) => {
  if (!targetID)
    return send(player, '<b>Используйте /tpto [ID игрока]</b>', false, 'SERVER')

  const target = mp.players.at(targetID)

  if (mp.players.exists(targetID) || target === undefined)
    return send(player, '<b>Игрок не в сети!</b>', false, 'SERVER')


  const posTarget = target.position
  player.position = new mp.Vector3(posTarget.x, posTarget.y, posTarget.z + 0.2)
})