import * as fs from 'fs'
import * as path from 'path'

import { registerCMD } from '../menus/chat'
import { send } from '../menus/chat'
import { rce } from '../utils/rce'
import {data} from "../database/mysql";
import chalk from "chalk";

registerCMD('getpos', (player: PlayerMp, [target, ...namePos]: [string, ...string[]]) => {
    const targetId = parseInt(target, 10)
    const fullNamePos = namePos.join(' ');

    const foundTarget = mp.players.at(targetId)
    const filePath = 'E:/PROJECTS/REAL-RP/A • targetPosition.txt'
    
    if (!target || !namePos.length) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    } else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }

    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x}, ${foundTarget.position.y}, ${foundTarget.heading}\n [JSON]: { "x": ${foundTarget.position.x}, "y": ${foundTarget.position.y}, "z": ${foundTarget.position.z}, "rot": ${foundTarget.heading} }\n`;
    
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


registerCMD('vehposrent', async (player: PlayerMp, [vehModel, idColumn]) => {
  if (!player.vehicle) {
    return rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не находится в транспортном средстве!', 5000, 'bottom')
  }

  if (!vehModel || !idColumn) {
    return send(player, 'Используйте: /vehposrent [модель т/с] [id колонки]', false, 'SERVER')
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