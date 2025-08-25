'use strict';

var jsonfile = require('jsonfile');
var fs = require('fs');
var perf_hooks = require('perf_hooks');
var path = require('path');
var mysql = require('mysql2');
var chalk = require('chalk');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var mysql__namespace = /*#__PURE__*/_interopNamespaceDefault(mysql);

mp.events.add('playerJoin', (player) => {
    const socialClub = player.socialClub;
    const whitelist = ['HaseNRP', 'Anaken74', 'whysh1n3'];
    if (!whitelist.includes(socialClub)) {
        player.kick('Вы не добавлены в Whitelist!');
        console.log(`Not in Whitelist: ${player.socialClub}`);
    }
});

mp.events.add('playerJoin', (player) => {
    player.dimension = player.id;
    console.log(`${player.socialClub} подключился!!! dim: ${player.dimension}`);
    player.model = mp.joaat('mp_m_freemode_01');
    player.spawn(new mp.Vector3(3335.050537109375, 5162.82177734375, 18.2938232421875));
    player.heading = 144;
    player.health = 100;
    player.armour = 200;
});

class CustomEventBase {
    static registerLocalIds = 1;
    static registerHandles = new Map();
    static clearRegister(eventName) {
        this.registerHandles.forEach((value, key) => {
            if (value[0] === eventName)
                this.registerHandles.delete(key);
        });
    }
    static clearRegisterAll() {
        this.registerHandles.clear();
    }
    static register(eventName, handle) {
        // Очистка старых обработчиков для этого события
        this.clearRegister(eventName);
        const id = `${this.registerLocalIds++}`;
        this.registerHandles.set(id, [eventName, handle]);
        return { destroy: () => this.registerHandles.delete(id) };
    }
    static trigger(eventName, ...args) {
        this.registerHandles.forEach(([name, handle]) => {
            if (name === eventName)
                handle(...args);
        });
    }
    static async call(eventName, ...args) {
        for (const [name, handle] of this.registerHandles.values()) {
            if (name === eventName)
                return await handle(...args);
        }
        return null;
    }
}

class NoSQLbase {
    inited = false;
    get data() {
        return this.datas;
    }
    set data(val) {
        this.datas = val;
        // this.save();
    }
    insert(...val) {
        this.data.push(...val);
        return this.data[this.data.length - 1];
        // this.save();
    }
    remove(val) {
        if (typeof val === "number") {
            this.data.splice(val, 1);
        }
        else {
            this.data.splice(this.data.indexOf(val), 1);
        }
    }
    plusMinus(value, param, plus) {
        for (let arg in value) {
            if (typeof value[arg] !== "number") {
                return console.error("Invalid argument type", arg, typeof value[arg], value[arg]);
            }
        }
        let data = this.find(param);
        if (data.length == 0)
            return;
        data.map(itm => {
            for (let arg in value) {
                if (typeof itm[arg] === "number") {
                    if (plus) {
                        // @ts-ignore
                        itm[arg] += value[arg];
                    }
                    else {
                        // @ts-ignore
                        itm[arg] -= value[arg];
                    }
                }
            }
        });
    }
    increment(value, param) {
        this.plusMinus(value, param, true);
    }
    decrement(value, param) {
        this.plusMinus(value, param, false);
    }
    clear() {
        this.data = [];
    }
    save() {
        if (this.file == ":memory:")
            return;
        jsonfile.writeFileSync('./nosql/' + this.file + '.json', this.datas);
    }
    find(param) {
        let data = [];
        if (!param.limit)
            param.limit = 1;
        const check = (el) => {
            let ok = true;
            for (let arg in param.where) {
                if (el[arg] != param.where[arg])
                    ok = false;
            }
            return ok;
        };
        return this.data.filter(itm => {
            if (data.length >= param.limit)
                return false;
            return check(itm);
        });
    }
    findOne(param) {
        let data = this.find({ ...param, limit: 1 });
        if (data.length > 0)
            return data[0];
    }
    datas;
    onInitHandler;
    file;
    constructor(file = ":memory:", onInitHandler) {
        this.file = file;
        this.onInitHandler = onInitHandler;
        this.data = [];
        this.init().then(() => {
            if (this.onInitHandler) {
                this.onInitHandler();
            }
        });
    }
    init() {
        return new Promise((resolve, reject) => {
            if (this.inited)
                return this.data;
            if (!fs.existsSync('./nosql/')) {
                fs.mkdirSync('./nosql/');
            }
            if (this.file == ":memory:")
                return resolve(this.data);
            if (this.file.includes('/')) {
                if (this.file.indexOf('/') === 0)
                    this.file = this.file.replace('/', '');
                let urls = [];
                this.file.split('/').map((url, index, array) => {
                    if (index === array.length - 1)
                        return;
                    urls.push(url);
                    if (!fs.existsSync(`./nosql/${urls.join('/')}`)) {
                        fs.mkdirSync(`./nosql/${urls.join('/')}`);
                    }
                });
            }
            jsonfile.readFile('./nosql/' + this.file + '.json').then(obj => {
                this.data = obj;
                this.inited = true;
                resolve(this.data);
            }).catch(err => {
                jsonfile.writeFile('./nosql/' + this.file + '.json', [], function (err) {
                    if (err)
                        console.error(err);
                });
                // system.debug.debug("Create new NoSQL instance " + this.file);
                this.data = [];
                this.inited = true;
                resolve(this.data);
            });
        });
    }
}

const PERFOMANCE_MIN_TIME = 20;
const eventsPerfomanceTestResults = new NoSQLbase('perfomanceTest');
class rce extends CustomEventBase {
    static clientPoolLog = new Map();
    static clientEvents = new Map();
    static clientCallHandle = new Map();
    static clientCallId = 0;
    static key = rce.getRandomKey();
    static getRandomKey() {
        return Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
    }
    static decryptEventName(eventName) {
        return eventName
            .split('g')
            .filter(Boolean)
            .map(s => String.fromCharCode(parseInt(s, 16) ^ rce.key))
            .join('');
    }
    static encryptEventName(eventName) {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
            .join('g');
    }
    static registerClientCef(name, handle) {
        this.registerClient(name, handle);
        this.registerCef(name, handle);
    }
    static registerClient(name, handle) {
        const encryptedName = this.encryptEventName(name);
        if (!this.clientEvents.has(encryptedName)) {
            this.clientEvents.set(encryptedName, new Set());
        }
        this.clientEvents.get(encryptedName).add(handle);
    }
    static unregisterClient(name, handle) {
        const encryptedName = this.encryptEventName(name);
        const handlers = this.clientEvents.get(encryptedName);
        if (handlers) {
            handlers.delete(handle);
        }
    }
    static cefEvents = new Map();
    static registerCef(name, handle) {
        const encryptedName = this.encryptEventName(name);
        if (!this.cefEvents.has(encryptedName)) {
            this.cefEvents.set(encryptedName, new Set());
        }
        this.cefEvents.get(encryptedName).add(handle);
    }
    static unregisterCef(name, handle) {
        const encryptedName = this.encryptEventName(name);
        const handlers = this.cefEvents.get(encryptedName);
        if (handlers) {
            handlers.delete(handle);
        }
    }
    static registerClientAndCef(name, handle) {
        this.registerClient(name, handle);
        this.registerCef(name, handle);
    }
    static triggerCef(player, eventName, ...args) {
        if (!mp.players.exists(player))
            return;
        player.call('cef:trigger:event', [eventName, JSON.stringify(args)]);
    }
    static triggerCefAll(eventName, ...args) {
        mp.players.call('cef:trigger:event', [eventName, JSON.stringify(args)]);
    }
    static triggerClient(player, eventName, ...args) {
        if (!mp.players.exists(player))
            return;
        return this.triggerCl(player, eventName, ...args);
    }
    static triggerClients(eventName, ...args) {
        return this.triggerCl(mp.players, eventName, ...args);
    }
    static triggerCl(pl, eventName, ...args) {
        const argsString = JSON.stringify(args);
        if (argsString.length >= 32700) {
            const ids = Math.floor(Math.random() * (999999 - 111111)) + 111111;
            let arr = [];
            for (let i = 0; i < argsString.length; i += 32500)
                arr.push(argsString.slice(i, i + 32500));
            arr.map((itm, index) => {
                pl.call('client:trigger:event:split', [ids, index, index == (arr.length - 1), eventName, itm]);
            });
        }
        else {
            pl.call('client:trigger:event', [eventName, argsString]);
        }
    }
    static callClient(player, eventName, ...args) {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player))
                return;
            const reqId = parseInt(`${this.clientCallId++}`);
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)]);
        });
    }
    static callCef(player, eventName, ...args) {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player))
                return;
            const reqId = parseInt(`${this.clientCallId++}`);
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)]);
        });
    }
}
mp.events.add('client:call:event:result', (player, reqId, result) => {
    let res = rce.clientCallHandle.get(reqId);
    if (res)
        res[0](result);
    rce.clientCallHandle.delete(reqId);
});
mp.events.add('trigger:client', (player, name, argss) => {
    const nowTm = Date.now() / 1000 | 0;
    if (rce.clientPoolLog.has(`${player.id}_____${name}`)) {
        const old = rce.clientPoolLog.get(`${player.id}_____${name}`);
        if (old.last + 2 > nowTm) {
            old.count++;
            if (old.count === 10) ;
            rce.clientPoolLog.set(`${player.id}_____${name}`, old);
        }
        else {
            rce.clientPoolLog.set(`${player.id}_____${name}`, { count: 1, last: nowTm });
        }
    }
    else {
        rce.clientPoolLog.set(`${player.id}_____${name}`, { count: 1, last: nowTm });
    }
    const handlers = rce.clientEvents.get(name);
    if (handlers) {
        handlers.forEach(handler => {
            const t1 = perf_hooks.performance.now();
            handler(player, ...(JSON.parse(argss)));
            const t2 = perf_hooks.performance.now();
            const time = t2 - t1;
            if (time > PERFOMANCE_MIN_TIME) {
                console.debug(`Client event '${rce.decryptEventName(name)}' executed in ${time} ms}.`);
                const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name);
                if (!existedResult)
                    eventsPerfomanceTestResults.insert({
                        count: 1,
                        averageExecutionTime: time,
                        eventName: name
                    });
                else {
                    existedResult.count++;
                    existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count;
                }
            }
        });
    }
});
mp.events.add('call:client', (player, requestID, name, argss) => {
    const nowTm = Date.now() / 1000 | 0;
    if (rce.clientPoolLog.has(`${player.id}_____${name}`)) {
        const old = rce.clientPoolLog.get(`${player.id}_____${name}`);
        if (old.last + 2 > nowTm) {
            old.count++;
            if (old.count === 10) ;
            rce.clientPoolLog.set(`${player.id}_____${name}`, old);
        }
        else {
            rce.clientPoolLog.set(`${player.id}_____${name}`, { count: 1, last: nowTm });
        }
    }
    else {
        rce.clientPoolLog.set(`${player.id}_____${name}`, { count: 1, last: nowTm });
    }
    const handlers = rce.clientEvents.get(name);
    if (handlers) {
        handlers.forEach(async (handler) => {
            if (!mp.players.exists(player))
                return;
            let res;
            try {
                res = await handler(player, ...(JSON.parse(argss)));
            }
            catch (error) {
                console.error(error);
            }
            if (!mp.players.exists(player))
                return;
            player.call('call:client:response', [requestID, res]);
        });
    }
});
mp.events.add('trigger:cef', (player, name, args) => {
    const nowTm = Date.now() / 1000 | 0;
    if (rce.clientPoolLog.has(`${player.id}_CEF____${name}`)) {
        const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if (old.last + 2 > nowTm) {
            old.count++;
            if (old.count === 10) ;
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old);
        }
        else {
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, { count: 1, last: nowTm });
        }
    }
    else {
        rce.clientPoolLog.set(`${player.id}_CEF____${name}`, { count: 1, last: nowTm });
    }
    const handlers = rce.cefEvents.get(name);
    if (handlers) {
        handlers.forEach(handler => {
            const t1 = perf_hooks.performance.now();
            handler(player, ...(JSON.parse(args)));
            const t2 = perf_hooks.performance.now();
            const time = t2 - t1;
            if (time > PERFOMANCE_MIN_TIME) {
                console.debug(`Client event '${rce.decryptEventName(name)}' executed in ${time} ms}.`);
                const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name);
                if (!existedResult)
                    eventsPerfomanceTestResults.insert({
                        count: 1,
                        averageExecutionTime: time,
                        eventName: name
                    });
                else {
                    existedResult.count++;
                    existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count;
                }
            }
        });
    }
});
mp.events.add('call:cef', (player, requestID, name, ...args) => {
    const nowTm = Date.now() / 1000 | 0;
    if (rce.clientPoolLog.has(`${player.id}_CEF____${name}`)) {
        const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if (old.last + 2 > nowTm) {
            old.count++;
            if (old.count === 10) ;
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old);
        }
        else {
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, { count: 1, last: nowTm });
        }
    }
    else {
        rce.clientPoolLog.set(`${player.id}_CEF____${name}`, { count: 1, last: nowTm });
    }
    const handlers = rce.cefEvents.get(name);
    if (handlers) {
        handlers.forEach(async (handler) => {
            if (!mp.players.exists(player))
                return;
            let res;
            try {
                res = await handler(player, ...args);
            }
            catch (error) {
                console.error(error);
            }
            if (!mp.players.exists(player))
                return;
            player.call('call:cef:response', [requestID, res]);
        });
    }
});
mp.events.add('playerJoin', (player) => {
    player.call('setKey', [rce.key]);
});

const cmdHandlers = {};
const mutedPlayers = new Map();
const CHAT_MESSAGE_EVENT = 'chat:message';
const send = (player, msg, showTime, tile) => {
    if (!player) {
        console.error('[CHAT SEND] player не должен быть равен null. Используй chat.broadcast');
        return;
    }
    else {
        rce.triggerClient(player, CHAT_MESSAGE_EVENT, null, msg, showTime, tile);
    }
};
const broadcast = (msg, showTime, tile) => {
    rce.triggerClients(CHAT_MESSAGE_EVENT, null, msg, showTime, tile);
};
const registerCMD = (cmd, callback) => {
    if (cmdHandlers[cmd] !== undefined) {
        console.log(`Не удалось зарегистрировать команду (/${cmd}), которая уже зарегистрирована!`);
    }
    else {
        cmdHandlers[cmd] = callback;
    }
};
const invokeCMD = (player, cmd, args) => {
    cmd = cmd.toLowerCase();
    const callback = cmdHandlers[cmd];
    if (callback) {
        callback(player, args);
    }
    else {
        send(player, `{ffcbbb} <b>Команда не найдена! (/${cmd})</b>`, false);
    }
};
rce.registerClientCef(CHAT_MESSAGE_EVENT, (player, msg, showTime, tile) => {
    if (msg.startsWith('/')) {
        msg = msg.trim().slice(1);
        if (msg.length > 0) {
            const args = msg.split(" ");
            const cmd = args.shift();
            invokeCMD(player, cmd, args);
        }
    }
    else {
        if (mutedPlayers.has(player) && mutedPlayers.get(player)) {
            send(player, '{E52B50} У вас бан-чат!', false);
            return;
        }
        msg = msg.trim();
        if (msg.length > 0) {
            const formattedMsg = msg.replace(/</g, "&lt;").replace(/'/g, "&#39;").replace(/"/g, "&#34;");
            mp.players.forEachInRange(player.position, 8, (player) => {
                rce.triggerClient(player, CHAT_MESSAGE_EVENT, player.name, formattedMsg, showTime, tile);
            });
        }
    }
});
rce.registerClientCef('sendMsg', (player, msg, showTime, tile) => {
    send(player, msg, showTime, tile);
});
rce.registerClientCef('broadcastMsg', (player, msg, showTime, tile) => {
    broadcast(msg, showTime, tile);
});

registerCMD('me', (player, args) => {
    const text = args.join(' ');
    if (!text) {
        send(player, 'Используйте <b>/me [текст]</b>', false);
        return;
    }
    mp.players.forEachInRange(player.position, 8, (p) => {
        send(p, `{FFA96C}<b>Гражданин #${player.socialClub} ${text}</b>`, true, 'me');
    });
});
registerCMD('do', (player, args) => {
    const text = args.join(' ');
    if (!text) {
        send(player, 'Используйте <b>/do [текст]</b>', false);
        return;
    }
    const formatedText = text.charAt(0).toUpperCase() + text.slice(1);
    const finalText = formatedText.endsWith('.') ? formatedText : formatedText + '.';
    mp.players.forEachInRange(player.position, 8, (p) => {
        send(p, `{9FFF97}<b>${finalText} (${player.socialClub})</b>`, true, 'do');
    });
});
registerCMD('try', (player, args) => {
    const text = args.join(' ');
    const outcomes = ['successful', 'unsuccessful'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    if (!text) {
        send(player, 'Используйте <b>/try [текст]</b>', false);
        return;
    }
    mp.players.forEachInRange(player.position, 8, (p) => {
        if (randomOutcome === 'successful') {
            send(p, `{00FF51}<b>[${player.socialClub}]: ${text} => (Удачно 😄)</b>`, true, 'try');
        }
        else {
            send(p, `{FF0037}<b>[${player.socialClub}]: ${text} => (Неудачно 😞)</b>`, true, 'try');
        }
    });
});
registerCMD('todo', (player, args) => {
    const text = args.join(' ');
    const parts = text.split('*');
    const action = parts[0]?.trim();
    const sayChar = parts[1]?.trim();
    if (!text) {
        send(player, 'Используйте <b>/todo [действие персонажа (Что сделав?) * фраза персонажа]</b>', false);
    }
    else if (!action) {
        send(player, 'Не указано действие персонажа! (Вопрос: Что сделав?)', false);
    }
    else if (!sayChar) {
        send(player, 'Не указана фраза вашего персонажа!', false);
    }
    else {
        const formatedAction = action.charAt(0).toUpperCase() + action.slice(1);
        const formatedSayChar = sayChar.charAt(0).toUpperCase() + sayChar.slice(1);
        mp.players.forEachInRange(player.position, 8, (p) => {
            send(p, `<b>${formatedAction}, ${player.socialClub} сказал: "${formatedSayChar}"</b>`, true, 'todo');
        });
    }
});
registerCMD('clearchat', (player) => {
    rce.triggerClient(player, 'clearChat');
    send(player, '<b>Ваш чат был успешно очищен!</b>', false, 'SERVER');
});

const data = mysql__namespace.createPool({
    host: 'localhost',
    user: 'root',
    database: 'redstar',
    password: 'Patriot86',
    port: 3306
});
const mysql2 = {
    isConnected: false,
    sql: 'SELECT * FROM accounts'
};
const makeConnection = () => {
    data.getConnection((err, connection) => {
        if (err) {
            console.log(chalk.blueBright('• MYSQL • База данных не подключена! Повторная попытка через 2 секунды...'));
            setTimeout(makeConnection, 2000);
        }
        else {
            connection.query(mysql2.sql, (errQuery) => {
                if (errQuery) {
                    mysql2.isConnected = false;
                    console.log(chalk.bgRed('• MYSQL •') + chalk.red(` Ошибка подключения к БД! (Err: ${errQuery})`));
                }
                else {
                    mysql2.isConnected = true;
                    console.log(chalk.bgGreen('• MYSQL •') + chalk.green(' База данных подключена!'));
                }
            });
        }
    });
};
makeConnection();

registerCMD('getpos', (player, [target, ...namePos]) => {
    const targetId = parseInt(target, 10);
    const fullNamePos = namePos.join(' ');
    const foundTarget = mp.players.at(targetId);
    const filePath = 'E:/PROJECTS/REAL-RP/A • targetPosition.txt';
    if (!target || !namePos.length) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    }
    else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }
    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x}, ${foundTarget.position.y}, ${foundTarget.heading}\n [JSON]: { "x": ${foundTarget.position.x}, "y": ${foundTarget.position.y}, "z": ${foundTarget.position.z}, "rot": ${foundTarget.heading} }\n`;
    const dirPath = path__namespace.dirname(filePath);
    if (!fs__namespace.existsSync(dirPath)) {
        fs__namespace.mkdirSync(dirPath, { recursive: true });
    }
    fs__namespace.appendFile(filePath, locationTarget, (err) => {
        if (err) {
            send(player, `{ff3030}<b>Ошибка при записи позиции игрока!</b> (${err})`, false);
        }
        else {
            send(player, `{0eeb15}Позиция <b>Игрока #${target} успешно записана!</b>`, true, 'admin');
        }
    });
});
registerCMD('veh', (player, [target, model, r, g, b, numberPlate]) => {
    try {
        // Проверка обязательных аргументов
        if (model === undefined || target === undefined) {
            send(player, `<b>Используйте /veh [playerID] [model] [r?] [g?] [b?] [numberPlate?]</b>`, false, 'admin');
            return;
        }
        // Поиск целевого игрока
        const targetPlayer = mp.players.at(parseInt(target, 10));
        if (!targetPlayer) {
            send(player, `<b>Игрок #${target} не найден!</b>`, false, 'admin');
            return;
        }
        // Получаем позицию и поворот игрока
        const { position, heading, dimension } = targetPlayer;
        // Создаем транспорт
        const vehicle = mp.vehicles.new(mp.joaat(model), new mp.Vector3(position.x, position.y, position.z + 1.0 // +1.0 чтобы не спавнить под землей
        ), {
            engine: true,
            color: [
                [r || 255, g || 255, b || 255], // Первичный цвет (по умолчанию белый)
                [r || 255, g || 255, b || 255] // Вторичный цвет
            ],
            numberPlate: numberPlate || 'ADMIN',
            dimension: dimension,
            heading: heading // Используем heading вместо rotation.z
        });
        // Помещаем игрока в транспорт
        targetPlayer.putIntoVehicle(vehicle, 0);
    }
    catch (e) {
        console.error(`Ошибка при создании транспорта: ${e}`);
        send(player, `<b>Ошибка при создании транспорта: ${e.message}</b>`, false, 'admin');
    }
});
registerCMD('banvoice', (player, [target]) => {
    if (target === undefined) {
        return send(player, `<b>Используйте /banvoice [playerID]`, false, 'admin');
    }
    // if (target.getVariable('player_mute')) {
    //   return send(player, `<b>Игроку уже выдан бан-войс!</b>`, false, 'admin')
    // }
    const targetPlayer = mp.players.at(parseInt(target, 10));
    rce.triggerClient(targetPlayer, 'player:mute', true);
    send(targetPlayer, `<b>Вам выдан бан-войс!</b>`, true);
});
registerCMD('unbanvoice', (player, [target]) => {
    if (target === undefined) {
        return send(player, `<b>Используйте /unbanvoice [playerID]</b>`, false, 'admin');
    }
    // if (!target.getVariable('player_mute')) {
    //   return send(player, `<b>У игрока нет бан-войса!</b>`, false, 'admin')
    // }
    const targetPlayer = mp.players.at(parseInt(target, 10));
    rce.triggerClient(targetPlayer, 'player:mute', false);
    send(targetPlayer, `<b>С вас снят бан-войс!</b>`, true);
});
registerCMD('allclearchat', (player) => {
    rce.triggerClients('clearChat');
    mp.players.forEach(p => {
        send(p, '<b>Чат был очищен у всех!</b>', false, 'ADMIN');
    });
});
registerCMD('vehposrent', async (player, [vehModel, idColumn]) => {
    if (!player.vehicle) {
        return rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не находится в транспортном средстве!', 5000, 'bottom');
    }
    if (!vehModel || !idColumn) {
        return send(player, 'Используйте: /vehposrent [модель т/с] [id колонки]', false, 'SERVER');
    }
    const vehicle = player.vehicle;
    const vehPos = vehicle.position;
    const vehRot = vehicle.heading;
    const vehName = vehicle.model;
    try {
        const connection = await data.promise().getConnection();
        try {
            const [checkRows] = await connection.execute('SELECT id FROM rent WHERE id = ?', [Number(idColumn)]);
            if (checkRows.length === 0) {
                return rce.triggerClient(player, 'sendNotify', 'err', 'Запись в БД с указанным ID не существует!', 3000, 'bottom');
            }
            const [rows] = await connection.execute('SELECT vehiclesdata FROM rent WHERE id = ?', [Number(idColumn)]);
            let vehiclesData = [];
            if (rows[0].vehiclesdata) {
                try {
                    vehiclesData = JSON.parse(rows[0].vehiclesdata);
                }
                catch (e) {
                    console.error(`${chalk.bgRed('RENT')} Error JSON parsing: ${e}`);
                }
            }
            const vehiclesInfo = {
                vehName: vehModel,
                x: vehPos.x.toFixed(3),
                y: vehPos.y.toFixed(3),
                z: vehPos.z.toFixed(3),
                heading: vehRot.toFixed(3)
            };
            const existingIndex = vehiclesData.indexOf((idx) => idx.name === vehName);
            if (existingIndex !== -1) {
                vehiclesData[existingIndex] = vehiclesInfo;
            }
            else {
                vehiclesData.push(vehiclesInfo);
            }
            await connection.execute('UPDATE rent SET vehiclesdata = ? WHERE id = ?', [JSON.stringify(vehiclesData), Number(idColumn)]);
            rce.triggerClient(player, 'sendNotify', 'success', 'Позиция т/с сохранена в БД!', 5000, 'bottom');
        }
        finally {
            connection.release();
        }
    }
    catch (e) {
        console.error(`${chalk.bgRed('RENT')} ${e}`);
    }
});
registerCMD('pedposrent', async (player, [idColumn, modelName, ...pedName]) => {
    const fullPedName = pedName.join(' ');
    if (!pedName || !idColumn || !modelName) {
        return send(player, `Используйте: /pedposrent [id колонки] [название модели] [имя Ped'a]`, false, 'SERVER');
    }
    const pedPos = player.position;
    const pedRot = player.heading;
    try {
        const connection = await data.promise().getConnection();
        try {
            const [checkRows] = await connection.execute('SELECT id FROM rent WHERE id = ?', [Number(idColumn)]);
            if (checkRows.length === 0) {
                return rce.triggerClient(player, 'sendNotify', 'err', 'Запись в БД с указанным ID не существует!', 3000, 'bottom');
            }
            const pedData = {
                x: pedPos.x.toFixed(3),
                y: pedPos.y.toFixed(3),
                z: pedPos.z.toFixed(3),
                heading: pedRot.toFixed(3)
            };
            await connection.execute('UPDATE rent SET pedname = ?, modelname = ?, pedpos = ? WHERE id = ?', [fullPedName, modelName, JSON.stringify(pedData), Number(idColumn)]);
            rce.triggerClient(player, 'sendNotify', 'success', `Позиция Ped'a сохранена в БД!`, 5000, 'bottom');
        }
        finally {
            connection.release();
        }
    }
    catch (e) {
        console.error(`${chalk.bgRed('RENT')} ${e}`);
    }
});
registerCMD('setdim', (player, [targetID, dimension]) => {
    if (!targetID || !dimension)
        return send(player, '<b>Используйте /setdim [ID игрока] [dimension]</b>', false, 'SERVER');
    const target = mp.players.at(targetID);
    target.dimension = Number(dimension);
    rce.triggerClient(target, 'sendNotify', 'info', `Вам установлен dimension #${dimension}!`, 4000, 'bottom');
    rce.triggerClient(player, 'sendNotify', 'info', `Игроку (ID: ${targetID}) установлен dimension #${dimension}!`, 3000, 'top');
});

const transporter$1 = nodemailer.createTransport({
    service: 'yandex',
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'redstar.games2025@yandex.ru',
        pass: 'bskbfnbojgracain'
    }
});
const verifyCodes = {};
const sendCodeVerify = (player, email) => {
    const generatedCode = (length = 8) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };
    const code = generatedCode();
    verifyCodes[player.id] = code;
    const mailOptions = {
        from: 'redstar.games2025@yandex.ru',
        to: email,
        subject: '✅ Подтверждение электронной почты • REDSTAR RP',
        html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Header with logo -->
        <div style="background: linear-gradient(135deg, #161523 0%, #2a1a4a 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; color: #fff; font-weight: 600; letter-spacing: 1px;">REDSTAR ROLEPLAY</h1>
        </div>
        
        <!-- Main content -->
        <div style="background: #f5f5f5; padding: 30px 20px; color: #333;">
          <h2 style="margin-top: 0; color: #161523; font-weight: 600;">Подтверждение эл.почты</h2>
          <p style="font-size: 16px; line-height: 1.5;">Вы регистрируете новый аккаунт на сервере и для подтверждения электронной почты вам требуется ввести следующий код:</p>
          
          <!-- Verification code box -->
          <div style="margin: 25px 0; text-align: center;">
            <div style="display: inline-block; background: #f8f8f8; border: 1px dashed #d1d1d1; padding: 15px 30px; border-radius: 6px;">
              <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 3px; color: #FF0C46;">${code}</p>
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Этот код действителен в течение 15 минут. Никому не сообщайте этот код.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 14px; color: #777;">Если вы не запрашивали код для подтверждения электронной почты, проигнорируйте это сообщение или сообщите об этом нам в дискорд: https://discord.com/invite/JyNY89CUjE</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #777;">
          <p style="margin: 0;">© 2025 REDSTAR ROLEPLAY. Все права защищены.</p>
          <p style="margin: 5px 0 0;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    `
    };
    transporter$1.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(chalk.bgRed('• NODEMAILER • ' + chalk.red(`Ошибка отправки почты (${email}): ${error}`)));
            return;
        }
        rce.triggerCef(player, 'server:verify:successSendCode');
        rce.triggerClient(player, 'sendNotify', 'info', `Код отправлен на почту "${email}". Если письма нет, то проверьте раздел "СПАМ"!`, 7000, 'bottom');
    });
};
const verifyEmail = (player, code, login, email, password) => {
    if (verifyCodes[player.id] && verifyCodes[player.id] === code) {
        delete verifyCodes[player.id];
        registerUser(player, login, email, password);
    }
    else {
        rce.triggerClient(player, 'sendNotify', 'err', `Неверный код подтверждения!`, 4500, 'bottom');
    }
};

const checkUser = (player, login, email, password) => {
    const socialClubName = player.socialClub;
    const checkSql = 'SELECT * FROM accounts WHERE login = ? OR email = ? OR socialClubName = ?';
    data.query(checkSql, [login, email, socialClubName], (err, results) => {
        if (err) {
            console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (checkSql > register): ${err}`)));
            return;
        }
        const users = results;
        if (Array.isArray(users) && users.length > 0) {
            const existingSocialClub = users.find(user => user.socialClubName = socialClubName);
            if (existingSocialClub) {
                rce.triggerClient(player, 'sendNotify', 'err', `Пользователь с вашим Social Club уже зарегистрирован!`, 5500, 'right');
                return;
            }
            rce.triggerClient(player, 'sendNotify', 'err', `Пользователь с данным Email / логином уже зарегистрирован!`, 5000, 'right');
            return;
        }
        sendCodeVerify(player, email);
        rce.triggerCef(player, 'server:auth:showVerify');
    });
};
const registerUser = (player, login, email, password) => {
    const socialClubName = player.socialClub;
    const generatedSID = (callback) => {
        const sidSql = 'SELECT MAX(sid) AS maxSid FROM accounts';
        data.query(sidSql, [], (err, result) => {
            if (err) {
                console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (getNextSID): ${err}`)));
                return callback(err, null);
            }
            const maxSid = result[0]?.maxSid || 0;
            const newSid = maxSid < 1 ? 1 : maxSid + 1;
            callback(null, newSid);
        });
    };
    const registerNewAccount = (sid) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка хеширования пароля (reg): ${err}`)));
            }
            const sql = 'INSERT INTO accounts (login, email, password, sid, socialClubName) VALUES (?, ?, ?, ?, ?)';
            data.query(sql, [login, email, hash, sid, socialClubName], (err) => {
                if (err) {
                    console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (regSql): ${err}`)));
                    return;
                }
                else {
                    player.dimension = 0;
                    player.setVariable('login_player', login);
                    rce.triggerClient(player, 'server:auth:saveLogin', login);
                    rce.triggerClient(player, 'sendNotify', 'success', `${login}, вы успешно зарегистрировались и подтвердили электронную почту!`, 5000, 'bottom');
                    rce.triggerCef(player, 'server:authSuccess');
                    console.log(`User ${login} created. sid: ${sid}`);
                    console.log(chalk.bgGreen('• REGISTER •') + chalk.green(` Пользователь ${login} успешно зарегистрирован`));
                }
            });
        });
    };
    generatedSID((err, newSID) => {
        if (err)
            return;
        registerNewAccount(newSID);
    });
};

const loginUser = (player, login, password) => {
    const checkSql = 'SELECT * FROM accounts WHERE login = ? OR email = ?';
    data.query(checkSql, [login, login, password], (err, results) => {
        if (err) {
            console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (checkSql > login): ${err}`)));
            return;
        }
        if (Array.isArray(results) && results.length === 0) {
            rce.triggerClient(player, 'sendNotify', 'err', `Аккаунт "${login}" не найден!`, 4500, 'right');
            return;
        }
        if (Array.isArray(results) && results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка сравнения пароля (login): ${err}`)));
                    return;
                }
                if (match) {
                    player.dimension = 0;
                    player.setVariable('login_player', login);
                    player.spawn(new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375));
                    rce.triggerClient(player, 'sendNotify', 'success', `${login}, вы успешно авторизовались!`, 4000, 'bottom');
                    rce.triggerClient(player, 'server:auth:saveLogin', login);
                    rce.triggerCef(player, 'server:authSuccess');
                    console.log(chalk.bgGreen('• LOGIN •') + chalk.green(` Пользователь ${login} успешно авторизован!`));
                }
                else {
                    rce.triggerClient(player, 'sendNotify', 'err', 'Неверный логин или пароль!', 5000, 'right');
                }
            });
        }
    });
};

const transporter = nodemailer.createTransport({
    service: 'yandex',
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'redstar.games2025@yandex.ru',
        pass: 'bskbfnbojgracain'
    }
});
const recoveryCodes = {};
const sendRecoveryCode = (player, email) => {
    const checkSql = 'SELECT * FROM accounts WHERE email = ?';
    data.query(checkSql, [email], (err, results) => {
        if (err) {
            console.log(chalk.bgRed('• MYSQL • ' + chalk.red(`Ошибка подключения (checkSql > login): ${err}`)));
            return;
        }
        if (Array.isArray(results) && results.length > 0) {
            const generatedCode = (length = 8) => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    result += characters[randomIndex];
                }
                return result;
            };
            const code = generatedCode();
            recoveryCodes[player.id] = code;
            const mailOptions = {
                from: 'redstar.games2025@yandex.ru',
                to: email,
                subject: '🔐 Код для восстановления пароля • REDSTAR RP',
                html: `
          <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Header with logo -->
            <div style="background: linear-gradient(135deg, #161523 0%, #2a1a4a 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #fff; font-weight: 600; letter-spacing: 1px;">REDSTAR ROLEPLAY</h1>
            </div>
            
            <!-- Main content -->
            <div style="background: #ffffff; padding: 30px 20px; color: #333;">
              <h2 style="margin-top: 0; color: #161523; font-weight: 600;">Восстановление доступа</h2>
              <p style="font-size: 16px; line-height: 1.5;">Вы запросили восстановление пароля для вашего аккаунта. Используйте следующий код подтверждения:</p>
              
              <!-- Verification code box -->
              <div style="margin: 25px 0; text-align: center;">
                <div style="display: inline-block; background: #f8f8f8; border: 1px dashed #d1d1d1; padding: 15px 30px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 3px; color: #FF0C46;">${code}</p>
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 1.5;">Этот код действителен в течение 15 минут. Никому не сообщайте этот код.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 14px; color: #777;">Если вы не запрашивали код для подтверждения электронной почты, проигнорируйте это сообщение или сообщите об этом нам в дискорд: https://discord.com/invite/JyNY89CUjE</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #777;">
              <p style="margin: 0;">© 2025 REDSTAR ROLEPLAY. Все права защищены.</p>
              <p style="margin: 5px 0 0;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(chalk.bgRed('• NODEMAILER • ' + chalk.red(`Ошибка отправки почты (${email}): ${error}`)));
                    return;
                }
                rce.triggerCef(player, 'server:recovery:successSendNotify');
                rce.triggerClient(player, 'sendNotify', 'info', `Код отправлен на почту "${email}". Если письма нет, то проверьте раздел "СПАМ"!`, 7000, 'right');
            });
        }
        else {
            rce.triggerClient(player, 'sendNotify', 'err', `Пользователь с данным Email не найден!`, 5000, 'right');
        }
    });
};
const changePassRecovery = (player, email, code, newPass) => {
    if (recoveryCodes[player.id] && recoveryCodes[player.id] === code) {
        bcrypt.hash(newPass, 10, (err, hash) => {
            if (err) {
                console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка хеширования пароля (changePassRecovery): ${err}`)));
                return;
            }
            const updateSql = 'UPDATE accounts SET password = ? WHERE email = ?';
            data.query(updateSql, [hash, email], (err) => {
                if (err) {
                    console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (changePassRecovery): ${err}`)));
                    return;
                }
                delete recoveryCodes[player.id];
                rce.triggerCef(player, 'server:auth:changePassSuccess');
                rce.triggerClient(player, 'sendNotify', 'success', `Пароль для аккаунта "${email}" успешно изменён!`, 5000, 'right');
            });
        });
    }
    else {
        rce.triggerClient(player, 'sendNotify', 'err', `Неверный код восстановления!`, 4500, 'right');
    }
};

rce.registerClient('client:authPlayerVisible', (player, visible) => {
    if (visible === false) {
        player.alpha = 0;
    }
    else {
        player.alpha = 255;
    }
});
rce.registerClient('client:startNewCamera', (player, coords) => {
    player.position = new mp.Vector3(coords.x, coords.y, coords.z);
});
rce.registerCef('cef:auth:regAccount', (player, login, email, password) => {
    checkUser(player, login, email);
});
rce.registerCef('cef:auth:verifyEmail', (player, code, login, email, password) => {
    verifyEmail(player, code, login, email, password);
});
rce.registerCef('cef:auth:sendCodeVerify', (player, email) => {
    sendCodeVerify(player, email);
});
rce.registerCef('cef:auth:loginAccount', (player, login, password) => {
    loginUser(player, login, password);
});
rce.registerCef('cef:auth:sendRecoveryCode', (player, email) => {
    sendRecoveryCode(player, email);
});
rce.registerCef('cef:auth:changePassRecovery', (player, email, code, newPass) => {
    changePassRecovery(player, email, code, newPass);
});

rce.registerClientCef('cef:serverCmd', (player, msg) => {
    console.log(`[CEF]: ${msg}`);
});
// rce.registerClientAndCef('playerReady', (player: PlayerMp) => {
//   player.call('server:webReady')
// })

rce.registerClient('client:playerDeath', (player, [posX, posY, posZ]) => {
    if (player.vehicle) {
        player.spawn(new mp.Vector3(posX, posY, posZ + 1));
    }
    else {
        player.spawn(new mp.Vector3(posX, posY, posZ));
    }
    player.playAnimation('amb@lo_res_idles@', 'world_human_bum_slumped_left_lo_res_base', 1, 15);
});
const playerKill = async (player) => {
    player.spawn(new mp.Vector3(-1221.006591796875, -100.9054946899414, 42.5238037109375));
    player.setVariable('player_knockout', false);
    rce.triggerClient(player, 'gui:cursorVisible', false);
    rce.triggerClient(player, 'ui:setPauseMenuActive', true);
    rce.triggerClient(player, 'ui:displayRadar', true);
    rce.triggerClient(player, 'player:freeze', false);
    rce.triggerClient(player, 'player:isCollision', true);
    rce.triggerClient(player, 'player:godmode', false);
    await setTimeout(() => {
        rce.triggerClient(player, 'graphics:stopAllScreenEffects');
    }, 4000);
    rce.triggerClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `finish`)']);
};
const playerKnockout = (player) => {
    player.health = 0;
    player.setVariable('player_knockout', true);
    if (player.vehicle) {
        rce.triggerClient(player, 'player:isCollision', true);
    }
    else {
        rce.triggerClient(player, 'player:isCollision', false);
    }
    rce.triggerClient(player, 'gui:cursorVisible', true);
    rce.triggerClient(player, 'player:freeze', true);
    rce.triggerClient(player, 'ui:setPauseMenuActive', false);
    rce.triggerClient(player, 'ui:displayRadar', false);
    rce.triggerClient(player, 'graphics:startScreenEffect', 'DeathFailMPIn', 0, true);
    setTimeout(() => {
        rce.triggerClient(player, 'player:godmode', true);
    }, 200);
};
const playerReborn = (player) => {
    const playerPos = player.position;
    player.health = 100;
    player.stopAnimation();
    player.spawn(playerPos);
    player.setVariable('player_knockout', false);
    rce.triggerClient(player, 'ui:displayRadar', true);
    rce.triggerClient(player, 'player:freeze', false);
    rce.triggerClient(player, 'player:isCollision', true);
    rce.triggerClient(player, 'player:godmode', false);
    rce.triggerClient(player, 'ui:setPauseMenuActive', true);
    rce.triggerClient(player, 'graphics:stopAllScreenEffects');
    rce.triggerClient(player, 'gui:cursorVisible', false);
    rce.triggerClient(player, 'execute', 'window.App.deathReducer.showDeath(``, `reborn`)');
    /*setTimeout(() => {
      rce.triggerClient(player, 'execute', `window.App.chatReducer.showChat()`)
    }, 5000)*/
};
rce.registerClientCef('playerKill', (player) => {
    playerKill(player);
});
rce.registerClientCef('playerKnockout', (player) => {
    playerKnockout(player);
});
rce.registerClientCef('playerReborn', (player) => {
    playerReborn(player);
});

let currentDateTime = {
    year: 0,
    month: 0,
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
};
let timeUpdateTimer;
let MOSCOW_UTC_OFFSET = 3 * 3600000;
const pad = (n) => n.toString().padStart(2, '0');
const getMoscowTime = () => {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + MOSCOW_UTC_OFFSET);
};
const updateTime = (isFirstRun = false) => {
    const moscowTime = getMoscowTime();
    currentDateTime = {
        year: moscowTime.getFullYear(),
        month: moscowTime.getMonth() + 1,
        day: moscowTime.getDate(),
        hours: moscowTime.getHours(),
        minutes: moscowTime.getMinutes(),
        seconds: moscowTime.getSeconds()
    };
    //mp.world.time.set(currentDateTime.hours, currentDateTime.minutes, currentDateTime.seconds)
    mp.world.time.set(8, 0, 0);
    if (!isFirstRun) {
        console.log(`Time: ${pad(currentDateTime.hours)}:${pad(currentDateTime.minutes)}`);
    }
    const nextMinute = (60 - moscowTime.getSeconds()) * 1000 - moscowTime.getMilliseconds();
    clearTimeout(timeUpdateTimer);
    timeUpdateTimer = setTimeout(() => {
        updateTime();
    }, nextMinute);
};
const initTimeSystem = () => {
    updateTime(true);
    console.log(chalk.bgBlueBright('• DATETIME •') + ` Дата и время были инициализированы`);
};
const getDateTime = (date = true, time = true) => {
    const { day, month, year, hours, minutes, seconds } = currentDateTime;
    if (!date && !time)
        return {};
    return {
        ...(date && { day, month, year }),
        ...(time && { hours, minutes, seconds })
    };
};
const getFormatedDateTime = (date = true, time = true, fullTime = false) => {
    const { day, month, year, hours, minutes, seconds } = currentDateTime;
    if (!date && !time)
        return {};
    const datePart = date ? `${pad(day)}.${pad(month)}.${year}` : '';
    const timePart = time ? `${pad(hours)}:${pad(minutes)}${fullTime ? `:${pad(seconds)}` : ''}` : '';
    return [datePart, timePart].filter(Boolean).join(' ');
};
rce.registerClientCef('getDateTime', (player, date, time) => {
    return getDateTime(date, time);
});
rce.registerClientCef('getFormatedDateTime', (player, date, time, fullTime) => {
    return getFormatedDateTime(date, time, fullTime);
});

mp.events.add('packagesLoaded', () => {
    initTimeSystem();
});

const pedPos = new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375);
for (let i = 0; i < 1; i++) {
    mp.peds.new(mp.joaat('mp_f_stripperlite'), pedPos, {
        dynamic: false,
        frozen: false,
        invincible: false,
    });
}

const getSid = (login) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM accounts WHERE login = ?';
        data.query(sql, [login], (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result[0].sid);
        });
    });
};

const getDataAccount = async (player, login, dataKey, targetID) => {
    const targetPlayer = mp.players.at(targetID);
    if (!targetPlayer) {
        console.error(chalk.red(`[RPC] Игрок с ID ${targetID} не найден!`));
        return null;
    }
    const targetLogin = targetPlayer.getVariable('login_player');
    if (!targetLogin) {
        console.error(chalk.red(`[RPC] У игрока ${targetID} нет логина!`));
        return null;
    }
    const dataMap = {
        sid: () => getSid(targetLogin)
    };
    if (!dataMap[dataKey])
        return console.error(chalk.bgRed('GET DATA •') + chalk.red(` Unknown data key: ${dataKey}`));
    return dataMap[dataKey]();
};
rce.registerClientCef('getDataAccount', async (player, dataKey, targetID) => {
    const login = player.getVariable('login_player');
    if (!login) {
        console.error(chalk.red(`Игрок ${login} не авторизован!`));
        return;
    }
    console.log(`СИД для ${login}: ${await getDataAccount(player, login, dataKey, targetID)}`);
    const result = await getDataAccount(player, login, dataKey, targetID);
    return result;
});

rce.registerClientCef('getIdPlayer', (player) => {
    return player.id;
});
rce.registerClientCef('player:mute', (player, state) => {
    player.setVariable('player_mute', state);
});

rce.registerClientCef('client:voice:new', (player, target) => {
    console.log(`Войс создан! (${target.id})`);
    if (target)
        player.enableVoiceTo(target);
});
rce.registerClientCef('client:voice:deleted', (player, target) => {
    console.log(`Войс удален! (${target.id})`);
    if (target)
        player.disableVoiceTo(target);
});

rce.registerClient('toggleNoclip', (player, toggle) => {
    if (toggle)
        player.alpha = 50;
    else
        player.alpha = 255;
});

let rentsData = [];
mp.events.add('playerJoin', async (player) => {
    rentsData.forEach(rent => {
        rce.triggerClient(player, 'createPed', rent.pedName, 'Местный арендатор', rent.modelName, [Number(rent.pedPos.x), Number(rent.pedPos.y), Number(rent.pedPos.z), Number(rent.pedPos.heading)], { isVisible: true, id: 811, color: 44 });
    });
});
const loadRent = async () => {
    try {
        const connection = await data.promise().getConnection();
        try {
            const [rows] = await connection.execute('SELECT * FROM rent');
            if (rows.length === 0) {
                return console.log(chalk.bgYellow("RENT") + chalk.yellow(" Таблица rents пустая!"));
            }
            rentsData = rows.map((row) => {
                let parsedPedpos = null;
                if (row.pedpos) {
                    try {
                        parsedPedpos = JSON.parse(row.pedpos);
                    }
                    catch (e) {
                        console.log(chalk.bgRed('RENT' + chalk.red(` Ошибка парсинга: ${e}`)));
                    }
                }
                // const ped: any = mp.peds.new(mp.joaat(row.modelname),
                //   new mp.Vector3(Number(parsedPedpos.x), Number(parsedPedpos.y), Number(parsedPedpos.z)),
                //   {
                //     dynamic: true,
                //     frozen: true,
                //     invincible: true,
                //     lockController: false,
                //     heading: row.heading,
                //     dimension: 0
                //   }
                // )
                return {
                    pedName: row.pedname,
                    modelName: row.modelname,
                    pedPos: parsedPedpos
                };
            });
            console.log(chalk.bgGreenBright("RENT") + chalk.greenBright(` Загружено ${rows.length} точек аренды`));
        }
        finally {
            await connection.release();
        }
    }
    catch (e) {
        console.error(chalk.bgRed('RENT' + chalk.red(` ${e}`)));
    }
};
loadRent();
