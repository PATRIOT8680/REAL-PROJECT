//import * as fs from 'fs'
//import * as path from 'path'

//import { registerCMD } from '../menus/chat'
//import { send } from '../menus/chat'

//registerCMD('getpos', (player: PlayerMp, [target, ...namePos]: [string, ...string[]]) => {
//    const targetId = parseInt(target, 10)
//    const fullNamePos = namePos.join(' ');

//    const foundTarget = mp.players.at(targetId)
//    const filePath = 'E:/PROJECTS/REDSTAR-RAGE/A • targetPosition.txt'
    
//    if (!target || !namePos.length) {
//        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
//        return;
//    } else if (!foundTarget) {
//        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
//        return;
//    }

//    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x}, ${foundTarget.position.y}, ${foundTarget.position.z} || ${foundTarget.rotation.x}, ${foundTarget.rotation.y}, ${foundTarget.rotation.z * (180 / Math.PI)}\n [JSON]: { "x": ${foundTarget.position.x}, "y": ${foundTarget.position.y}, "z": ${foundTarget.position.z}, "rot": ${foundTarget.rotation.z * (180 / Math.PI)} }\n`;
    
//    const dirPath = path.dirname(filePath);
//    if (!fs.existsSync(dirPath)) {
//      fs.mkdirSync(dirPath, { recursive: true });
//    }

//    fs.appendFile(filePath, locationTarget, (err) => {
//        if (err) {
//            send(player, `{ff3030}<b>Ошибка при записи позиции игрока!</b> (${err})`, false);
//        } else {
//            send(player, `{0eeb15}Позиция <b>Игрока #${target} успешно записана!</b>`, true, 'admin');
//        }
//    });
//});

//registerCMD('setdim', (player: PlayerMp, [target, dimension]: [string, number]) => {
//  const targetId = parseInt(target, 10)
//  const foundTarget = mp.players.at(targetId)

//  if (!target || !dimension) {
//    send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
//    return;
//  } else if (!foundTarget) {
//    send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin')
//    return
//  }

//  foundTarget.dimension = dimension
//})

//registerCMD('veh', (player: PlayerMp, [target, model, r, g, b, numberPlate]) => {
//  if (!model || !target) {
//    send(player, `<b>Используйте /veh [playerID?] [model] [r?] [g?] [b?] [numberPlate?]</b>`, false, 'admin')
//    return
//  }

//  const targetId = parseInt(target, 10)
//  const foundTarget = mp.players.at(targetId)

//  if (!foundTarget) {
//    send(player, `<b>Игрок #${target} не найден!</b>`, false, 'admin')
//    return
//  }

//  let vehicle: VehicleMp

//  try {
//    const pos = foundTarget.position
//    vehicle = mp.vehicles.new(mp.joaat(model), new mp.Vector3(pos.x, pos.y, pos.z), {
//      heading: foundTarget.rotation.z * (180 / Math.PI),
//      color: [[255, 255, 255], [255, 255, 255]],
//      dimension: foundTarget.dimension,
//      numberPlate: numberPlate || 'ADMIN'
//    })
//    foundTarget.putIntoVehicle(vehicle, 0)
//  } catch (e) {
//    send(player, `<b>Транспорт ${model} не найден!</b>`, false, 'admin')
//  }
//})