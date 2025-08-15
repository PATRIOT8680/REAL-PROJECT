'use strict';

var rageFwRpc = require('@entityseven/rage-fw-rpc');
var fs = require('fs');
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

const rpc = new rageFwRpc.Rpc({
    forceBrowserDevMode: false,
    debugLogs: false
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
        mp.players.forEach(p => {
            rpc.callClient(p, CHAT_MESSAGE_EVENT, [null, msg, showTime, tile]);
        });
    }
};
const broadcast = (msg, showTime, tile) => {
    mp.players.forEach(p => {
        rpc.callClient(p, CHAT_MESSAGE_EVENT, [null, msg, showTime, tile]);
    });
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
rpc.register(CHAT_MESSAGE_EVENT, (player, msg, showTime, tile) => {
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
            mp.players.forEach(p => {
                rpc.callClient(p, CHAT_MESSAGE_EVENT, [player.name, formattedMsg, showTime, tile]);
            });
        }
    }
});
rpc.register('sendMsg', (player, msg, showTime, tile) => {
    send(player, msg, showTime, tile);
});
rpc.register('broadcastMsg', (player, msg, showTime, tile) => {
    broadcast(msg, showTime, tile);
});

registerCMD('me', (player, args) => {
    const text = args.join(' ');
    if (!text) {
        send(player, 'Используйте <b>/me [текст]</b>', false);
        return;
    }
    broadcast(`{FFA96C}<b>Гражданин #${player.socialClub} ${text}</b>`, true, 'me');
});
registerCMD('do', (player, args) => {
    const text = args.join(' ');
    if (!text) {
        send(player, 'Используйте <b>/do [текст]</b>', false);
        return;
    }
    const formatedText = text.charAt(0).toUpperCase() + text.slice(1);
    const finalText = formatedText.endsWith('.') ? formatedText : formatedText + '.';
    broadcast(`{9FFF97}<b>${finalText} (${player.socialClub})</b>`, true, 'do');
});
registerCMD('try', (player, args) => {
    const text = args.join(' ');
    const outcomes = ['successful', 'unsuccessful'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    if (!text) {
        send(player, 'Используйте <b>/try [текст]</b>', false);
        return;
    }
    if (randomOutcome === 'successful') {
        broadcast(`{00FF51}<b>[${player.socialClub}]: ${text} => (Удачно 😄)</b>`, true, 'try');
    }
    else {
        broadcast(`{FF0037}<b>[${player.socialClub}]: ${text} => (Неудачно 😞)</b>`, true, 'try');
    }
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
        broadcast(`<b>${formatedAction}, ${player.socialClub} сказал: "${formatedSayChar}"</b>`, true, 'todo');
    }
});
registerCMD('testadmin', (player, args) => {
    const text = args.join(' ');
    send(player, `<b>${text}</b>`, true, 'admin');
});

registerCMD('getpos', (player, [target, ...namePos]) => {
    const targetId = parseInt(target, 10);
    const fullNamePos = namePos.join(' ');
    const foundTarget = mp.players.at(targetId);
    const filePath = 'E:/PROJECTS/REDSTAR-RAGE/A • targetPosition.txt';
    if (!target || !namePos.length) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    }
    else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }
    const locationTarget = `\n-- [${foundTarget.name} • ${fullNamePos}]: ${foundTarget.position.x}, ${foundTarget.position.y}, ${foundTarget.position.z} || ${foundTarget.rotation.x}, ${foundTarget.rotation.y}, ${foundTarget.rotation.z * (180 / Math.PI)}\n [JSON]: { "x": ${foundTarget.position.x}, "y": ${foundTarget.position.y}, "z": ${foundTarget.position.z}, "rot": ${foundTarget.rotation.z * (180 / Math.PI)} }\n`;
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
registerCMD('setdim', (player, [target, dimension]) => {
    const targetId = parseInt(target, 10);
    const foundTarget = mp.players.at(targetId);
    if (!target || !dimension) {
        send(player, 'Используйте <b>/getpos [targetId] [name pos]</b>', false);
        return;
    }
    else if (!foundTarget) {
        send(player, `{ff3030}<b>Игрок #${target} не найден!</b>`, false, 'admin');
        return;
    }
    foundTarget.dimension = dimension;
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
        rpc.callBrowser(player, 'server:verify:successSendCode');
        rpc.callClient(player, 'sendNotify', ['info', `Код отправлен на почту "${email}". Если письма нет, то проверьте раздел "СПАМ"!`, 7000, 'bottom']);
    });
};
const verifyEmail = (player, code, login, email, password) => {
    if (verifyCodes[player.id] && verifyCodes[player.id] === code) {
        delete verifyCodes[player.id];
        registerUser(player, login, email, password);
    }
    else {
        rpc.callClient(player, 'sendNotify', ['err', `Неверный код подтверждения!`, 4500, 'bottom']);
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
                rpc.callClient(player, 'sendNotify', ['err', `Пользователь с вашим Social Club уже зарегистрирован!`, 5500, 'right']);
                return;
            }
            rpc.callClient(player, 'sendNotify', ['err', `Пользователь с данным Email / логином уже зарегистрирован!`, 5000, 'right']);
            return;
        }
        sendCodeVerify(player, email);
        rpc.callBrowser(player, 'server:auth:showVerify');
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
                    rpc.callClient(player, 'server:auth:saveLogin', [login]);
                    rpc.callClient(player, 'sendNotify', ['success', `${login}, вы успешно зарегистрировались и подтвердили электронную почту!`, 5000, 'bottom']);
                    rpc.callBrowser(player, 'server:authSuccess');
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
            rpc.callClient(player, 'sendNotify', ['err', `Аккаунт "${login}" не найден!`, 4500, 'right']);
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
                    rpc.callClient(player, 'sendNotify', ['success', `${login}, вы успешно авторизовались!`, 4000, 'bottom']);
                    rpc.callClient(player, 'server:auth:saveLogin', [login]);
                    rpc.callBrowser(player, 'server:authSuccess');
                    console.log(chalk.bgGreen('• LOGIN •') + chalk.green(` Пользователь ${login} успешно авторизован!`));
                }
                else {
                    rpc.callClient(player, 'sendNotify', ['err', 'Неверный логин или пароль!', 5000, 'right']);
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
                rpc.callBrowser(player, 'server:recovery:successSendNotify');
                rpc.callClient(player, 'sendNotify', ['info', `Код отправлен на почту "${email}". Если письма нет, то проверьте раздел "СПАМ"!`, 7000, 'right']);
            });
        }
        else {
            rpc.callClient(player, 'sendNotify', ['err', `Пользователь с данным Email не найден!`, 5000, 'right']);
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
                rpc.callBrowser(player, 'server:auth:changePassSuccess');
                rpc.callClient(player, 'sendNotify', ['success', `Пароль для аккаунта "${email}" успешно изменён!`, 5000, 'right']);
            });
        });
    }
    else {
        rpc.callClient(player, 'sendNotify', ['err', `Неверный код восстановления!`, 4500, 'right']);
    }
};

rpc.register('client:authPlayerVisible', (player, visible) => {
    if (visible === false) {
        player.alpha = 0;
    }
    else {
        player.alpha = 255;
    }
});
rpc.register('client:startNewCamera', (player, coords) => {
    player.position = new mp.Vector3(coords.x, coords.y, coords.z);
});
rpc.register('cef:auth:regAccount', (player, login, email, password) => {
    checkUser(player, login, email);
});
rpc.register('cef:auth:verifyEmail', (player, code, login, email, password) => {
    verifyEmail(player, code, login, email, password);
});
rpc.register('cef:auth:sendCodeVerify', (player, email) => {
    sendCodeVerify(player, email);
});
rpc.register('cef:auth:loginAccount', (player, login, password) => {
    loginUser(player, login, password);
});
rpc.register('cef:auth:sendRecoveryCode', (player, email) => {
    sendRecoveryCode(player, email);
});
rpc.register('cef:auth:changePassRecovery', (player, email, code, newPass) => {
    changePassRecovery(player, email, code, newPass);
});

rpc.register('cef:serverCmd', (msg) => {
    console.log(`[CEF]: ${msg}`);
});
mp.events.add('playerReady', (player) => {
    player.call('server:webReady');
});

rpc.register('client:playerDeath', (player, [posX, posY, posZ]) => {
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
    rpc.callClient(player, 'gui:cursorVisible', [false]);
    rpc.callClient(player, 'ui:setPauseMenuActive', [true]);
    rpc.callClient(player, 'ui:displayRadar', [true]);
    rpc.callClient(player, 'player:freeze', [false]);
    rpc.callClient(player, 'player:isCollision', [true]);
    rpc.callClient(player, 'player:godmode', [false]);
    await setTimeout(() => {
        rpc.callClient(player, 'graphics:stopAllScreenEffects');
    }, 4000);
    rpc.callClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `finish`)']);
};
const playerKnockout = (player) => {
    player.health = 0;
    player.setVariable('player_knockout', true);
    if (player.vehicle) {
        rpc.callClient(player, 'player:isCollision', [true]);
    }
    else {
        rpc.callClient(player, 'player:isCollision', [false]);
    }
    rpc.callClient(player, 'gui:cursorVisible', [true]);
    rpc.callClient(player, 'player:freeze', [true]);
    rpc.callClient(player, 'ui:setPauseMenuActive', [false]);
    rpc.callClient(player, 'ui:displayRadar', [false]);
    rpc.callClient(player, 'graphics:startScreenEffect', ['DeathFailMPIn', 0, true]);
    setTimeout(() => {
        rpc.callClient(player, 'player:godmode', [true]);
    }, 200);
};
const playerReborn = (player) => {
    const playerPos = player.position;
    player.health = 100;
    player.stopAnimation();
    player.spawn(playerPos);
    rpc.callClient(player, 'ui:displayRadar', [true]);
    rpc.callClient(player, 'player:freeze', [false]);
    rpc.callClient(player, 'player:isCollision', [true]);
    rpc.callClient(player, 'player:godmode', [false]);
    rpc.callClient(player, 'ui:setPauseMenuActive', [true]);
    rpc.callClient(player, 'graphics:stopAllScreenEffects');
    rpc.callClient(player, 'gui:cursorVisible', [false]);
    rpc.callClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `reborn`)']);
    setTimeout(() => {
        rpc.callClient(player, 'execute', [`window.App.chatReducer.showChat()`]);
    }, 5000);
};
rpc.register('playerKill', (player) => {
    playerKill(player);
});
rpc.register('playerKnockout', (player) => {
    playerKnockout(player);
});
rpc.register('playerReborn', (player) => {
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
rpc.register('cef:getDateTime', (player, date, time) => {
    const dateTime = getDateTime(date, time);
    rpc.callBrowser(player, 'server:getDateTime', [dateTime]);
});
rpc.register('client:getDateTime', (player, date, time) => {
    const dateTime = getDateTime(date, time);
    rpc.callClient(player, 'server:getDateTime', [dateTime]);
});
rpc.register('cef:getFormatedDateTime', (player, date, time, fullTime) => {
    const dateTime = getFormatedDateTime(date, time, fullTime);
    rpc.callBrowser(player, 'server:getFormatedDateTime', [dateTime]);
    return getFormatedDateTime(date, time, fullTime);
});
rpc.register('client:getFormatedDateTime', (player, date, time, fullTime) => {
    const dateTime = getFormatedDateTime(date, time, fullTime);
    rpc.callClient(player, 'server:getFormatedDateTime', [dateTime]);
    return getFormatedDateTime(date, time, fullTime);
});

mp.events.add('packagesLoaded', () => {
    initTimeSystem();
});

const pedPos = new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375);
for (let i = 0; i < 3; i++) {
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

const getDataAccount = async (player, login, dataKey) => {
    const dataMap = {
        sid: () => getSid(login)
    };
    if (!dataMap[dataKey])
        return console.error(chalk.bgRed('GET DATA •') + chalk.red(` Unknown data key: ${dataKey}`));
    return dataMap[dataKey]();
};
rpc.register('getDataAccount', async (player, dataKey) => {
    const login = player.getVariable('login_player');
    if (!login) {
        console.error(chalk.red(`Игрок ${login} не авторизован!`));
        return;
    }
    const result = await getDataAccount(player, login, dataKey);
    return result;
});
