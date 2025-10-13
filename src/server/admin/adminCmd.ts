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


registerCMD('vehposrent', async (player: PlayerMp, [vehModel, price, idColumn]) => {
  if (!player.vehicle) {
    return rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не находится в транспортном средстве!', 5000, 'bottom')
  }

  if (!vehModel || !idColumn || !price) {
    return send(player, 'Используйте: /vehposrent [модель т/с] [цена] [id колонки]', false, 'SERVER')
  }

  const vehicle = player.vehicle
  const vehPos = vehicle.position
  const vehRot = vehicle.heading
  const vehName = vehicle.model

  try {
    const connection = await data.promise().getConnection()

    try {
      const [checkRows]: any = await connection.execute(
          'SELECT id FROM rent WHERE id = ?',
          [Number(idColumn)]
      )

      if (checkRows.length === 0) {
        return rce.triggerClient(player, 'sendNotify', 'err', 'Запись в БД с указанным ID не существует!', 3000, 'bottom')
      }

      const [rows]: any = await connection.execute(
          'SELECT vehiclesdata FROM rent WHERE id = ?',
          [Number(idColumn)]
      )

      let vehiclesData = []

      if (rows[0].vehiclesdata) {
        try {
          vehiclesData = JSON.parse(rows[0].vehiclesdata)
        } catch (e) {
          console.error(`${chalk.bgRed('RENT')} Error JSON parsing: ${e}`)
        }
      }

      const vehiclesInfo = {
        vehName: vehModel,
        price: Number(price),
        x: vehPos.x.toFixed(3),
        y: vehPos.y.toFixed(3),
        z: vehPos.z.toFixed(3),
        heading: vehRot.toFixed(3)
      }

      const existingIndex = vehiclesData.indexOf((idx: any) => idx.name === vehName)
      if (existingIndex !== -1) {
        vehiclesData[existingIndex] = vehiclesInfo
      } else {
        vehiclesData.push(vehiclesInfo)
      }

      await connection.execute(
          'UPDATE rent SET vehiclesdata = ? WHERE id = ?',
          [JSON.stringify(vehiclesData), Number(idColumn)]
      )

      rce.triggerClient(player, 'sendNotify', 'success', 'Позиция т/с сохранена в БД!', 5000, 'bottom');
    } finally {
      connection.release()
    }
  } catch (e) {
    console.error(`${chalk.bgRed('RENT')} ${e}`)
  }
})


registerCMD('pedposrent', async (player: PlayerMp, [idColumn, modelName, ...pedName]) => {
  const fullPedName = pedName.join(' ')

  if (!pedName || !idColumn || !modelName) {
    return send(player, `Используйте: /pedposrent [id колонки] [название модели] [имя Ped'a]`, false, 'SERVER')
  }

  const pedPos = player.position
  const pedRot = player.heading

  try {
    const connection = await data.promise().getConnection()

    try {
      const [checkRows]: any = await connection.execute(
          'SELECT id FROM rent WHERE id = ?',
        [Number(idColumn)]
      )

      if (checkRows.length === 0) {
        return rce.triggerClient(player, 'sendNotify', 'err', 'Запись в БД с указанным ID не существует!', 3000, 'bottom')
      }

      const pedData = {
        x: pedPos.x.toFixed(3),
        y: pedPos.y.toFixed(3),
        z: pedPos.z.toFixed(3),
        heading: pedRot.toFixed(3)
      }

      await connection.execute(
          'UPDATE rent SET pedname = ?, modelname = ?, pedpos = ? WHERE id = ?',
        [fullPedName, modelName, JSON.stringify(pedData), Number(idColumn)]
      )

      rce.triggerClient(player, 'sendNotify', 'success', `Позиция Ped'a сохранена в БД!`, 5000, 'bottom')
    } finally {
      connection.release()
    }
  } catch (e) {
    console.error(`${chalk.bgRed('RENT')} ${e}`)
  }
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