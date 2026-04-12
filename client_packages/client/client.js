'use strict';

global.Keys = {
    VK_LBUTTON: 0x01,
    VK_RBUTTON: 0x02,
    VK_CANCEL: 0x03,
    VK_MBUTTON: 0x04,
    VK_XBUTTON1: 0x05,
    VK_XBUTTON2: 0x06,
    VK_BACK: 0x08,
    VK_TAB: 0x09,
    VK_CLEAR: 0x0C,
    VK_ENTER: 0x0D,
    VK_SHIFT: 0x10,
    VK_CONTROL: 0x11,
    VK_MENU: 0x12,
    VK_ALT: 0x12,
    VK_PAUSE: 0x13,
    VK_CAPITAL: 0x14,
    VK_KANA: 0x15,
    VK_JUNJA: 0x17,
    VK_FINAL: 0x18,
    VK_HANJA: 0x19,
    VK_ESCAPE: 0x1B,
    VK_CONVERT: 0x1C,
    VK_NONCONVERT: 0x1D,
    VK_ACCEPT: 0x1E,
    VK_MODECHANGE: 0x1F,
    VK_SPACE: 0x20,
    VK_PRIOR: 0x21,
    VK_NEXT: 0x22,
    VK_END: 0x23,
    VK_HOME: 0x24,
    VK_LEFT: 0x25,
    VK_UP: 0x26,
    VK_RIGHT: 0x27,
    VK_DOWN: 0x28,
    VK_SELECT: 0x29,
    VK_PRINT: 0x2A,
    VK_EXECUTE: 0x2B,
    VK_SNAPSHOT: 0x2C,
    VK_INSERT: 0x2D,
    VK_DELETE: 0x2E,
    VK_HELP: 0x2F,
    VK_0: 0x30,
    VK_1: 0x31,
    VK_2: 0x32,
    VK_3: 0x33,
    VK_4: 0x34,
    VK_5: 0x35,
    VK_6: 0x36,
    VK_7: 0x37,
    VK_8: 0x38,
    VK_9: 0x39,
    VK_A: 0x41,
    VK_B: 0x42,
    VK_C: 0x43,
    VK_D: 0x44,
    VK_E: 0x45,
    VK_F: 0x46,
    VK_G: 0x47,
    VK_H: 0x48,
    VK_I: 0x49,
    VK_J: 0x4A,
    VK_K: 0x4B,
    VK_L: 0x4C,
    VK_M: 0x4D,
    VK_N: 0x4E,
    VK_O: 0x4F,
    VK_P: 0x50,
    VK_Q: 0x51,
    VK_R: 0x52,
    VK_S: 0x53,
    VK_T: 0x54,
    VK_U: 0x55,
    VK_V: 0x56,
    VK_W: 0x57,
    VK_X: 0x58,
    VK_Y: 0x59,
    VK_Z: 0x5A,
    VK_LWIN: 0x5B,
    VK_RWIN: 0x5C,
    VK_APPS: 0x5D,
    VK_SLEEP: 0x5F,
    VK_NUMPAD0: 0x60,
    VK_NUMPAD1: 0x61,
    VK_NUMPAD2: 0x62,
    VK_NUMPAD3: 0x63,
    VK_NUMPAD4: 0x64,
    VK_NUMPAD5: 0x65,
    VK_NUMPAD6: 0x66,
    VK_NUMPAD7: 0x67,
    VK_NUMPAD8: 0x68,
    VK_NUMPAD9: 0x69,
    VK_MULTIPLY: 0x6A,
    VK_ADD: 0x6B,
    VK_SEPARATOR: 0x6C,
    VK_SUBTRACT: 0x6D,
    VK_DECIMAL: 0x6E,
    VK_DIVIDE: 0x6F,
    VK_F1: 0x70,
    VK_F2: 0x71,
    VK_F3: 0x72,
    VK_F4: 0x73,
    VK_F5: 0x74,
    VK_F6: 0x75,
    VK_F7: 0x76,
    VK_F8: 0x77,
    VK_F9: 0x78,
    VK_F10: 0x79,
    VK_F11: 0x7A,
    VK_F12: 0x7B,
    VK_F13: 0x7C,
    VK_F14: 0x7D,
    VK_F15: 0x7E,
    VK_F16: 0x7F,
    VK_F17: 0x80,
    VK_F18: 0x81,
    VK_F19: 0x82,
    VK_F20: 0x83,
    VK_F21: 0x84,
    VK_F22: 0x85,
    VK_F23: 0x86,
    VK_F24: 0x87,
    VK_NUMLOCK: 0x90,
    VK_SCROLL: 0x91,
    VK_LSHIFT: 0xA0,
    VK_RSHIFT: 0xA1,
    VK_LCONTROL: 0xA2,
    VK_RCONTROL: 0xA3,
    VK_LMENU: 0xA4,
    VK_RMENU: 0xA5,
    VK_BROWSER_BACK: 0xA6,
    VK_BROWSER_FORWARD: 0xA7,
    VK_BROWSER_REFRESH: 0xA8,
    VK_BROWSER_STOP: 0xA9,
    VK_BROWSER_SEARCH: 0xAA,
    VK_BROWSER_FAVORITES: 0xAB,
    VK_BROWSER_HOME: 0xAC,
    VK_VOLUME_MUTE: 0xAD,
    VK_VOLUME_DOWN: 0xAE,
    VK_VOLUME_UP: 0xAF,
    VK_MEDIA_NEXT_TRACK: 0xB0,
    VK_MEDIA_PREV_TRACK: 0xB1,
    VK_MEDIA_STOP: 0xB2,
    VK_MEDIA_PLAY_PAUSE: 0xB3,
    VK_LAUNCH_MAIL: 0xB4,
    VK_LAUNCH_MEDIA_SELECT: 0xB5,
    VK_LAUNCH_APP1: 0xB6,
    VK_LAUNCH_APP2: 0xB7,
    VK_OEM_1: 0xBA,
    VK_OEM_PLUS: 0xBB,
    VK_OEM_COMMA: 0xBC,
    VK_OEM_MINUS: 0xBD,
    VK_OEM_PERIOD: 0xBE,
    VK_OEM_2: 0xBF,
    VK_OEM_3: 0xC0,
    VK_OEM_4: 0xDB,
    VK_OEM_5: 0xDC,
    VK_OEM_6: 0xDD,
    VK_OEM_7: 0xDE,
    VK_OEM_8: 0xDF,
    VK_OEM_102: 0xE2,
    VK_PROCESSKEY: 0xE5,
    VK_PACKET: 0xE7,
    VK_ATTN: 0xF6,
    VK_CRSEL: 0xF7,
    VK_EXSEL: 0xF8,
    VK_EREOF: 0xF9,
    VK_PLAY: 0xFA,
    VK_ZOOM: 0xFB,
    VK_NONAME: 0xFC,
    VK_PA1: 0xFD,
    VK_OEM_CLEAR: 0xFE
};
var Keys = global.Keys;

const drawSprite = (dist, name, pos, scale, heading, color, layer) => {
    const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    const textureResolution = mp.game.graphics.getTextureResolution(dist, name);
    const _scale = [
        (scale[0] * textureResolution.x) / resolution.x,
        (scale[1] * textureResolution.y) / resolution.y
    ];
    if (mp.game.graphics.hasStreamedTextureDictLoaded(dist)) {
        mp.game.graphics.drawSprite(dist, name, pos[0], pos[1], _scale[0], _scale[1], heading, color[0], color[1], color[2], color[3], false);
    }
    else
        mp.game.graphics.requestStreamedTextureDict(dist, true);
};

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
    static registerCallable(eventName, handle) {
        return this.register(eventName, handle); // пока используем тот же механизм
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

mp.events.add('setKey', (key) => {
    rce.key = key;
});
class rce extends CustomEventBase {
    static callServerResponse = 1;
    static cefCallId = 1;
    static requestServerHandle = new Map();
    static callServerResponseCEF = 1;
    static requestServerHandleCEF = new Map();
    static registerServerEvents = new Map();
    static registerSocketEvents = new Map();
    static cefPromises = new Map();
    // Добавляем обработчики для событий из CEF
    static cefHandlers = new Map();
    static key;
    static encryptEventName(eventName) {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
            .join('g');
    }
    static triggerServer(eventName, ...args) {
        mp.events.callRemote('trigger:client', rce.encryptEventName(eventName), JSON.stringify(args));
    }
    static async callCef(eventName, ...args) {
        const id = this.cefCallId++;
        mp.console.logWarning(`[CLIENT] Вызываем CEF ${eventName} с id=${id}`);
        return new Promise((resolve) => {
            this.cefPromises.set(id, resolve);
            this.triggerCef(eventName, id, ...args);
        });
    }
    static handleCefResponse(id, result) {
        const resolve = this.cefPromises.get(id);
        if (resolve) {
            resolve(result);
            this.cefPromises.delete(id);
        }
    }
    static callServer(eventName, ...args) {
        const requestID = rce.callServerResponse++;
        return new Promise((resolve, reject) => {
            rce.requestServerHandle.set(requestID, resolve);
            mp.events.callRemote('call:client', requestID, rce.encryptEventName(eventName), JSON.stringify(args));
        });
    }
    static triggerCef(eventName, ...args) {
        mp.browsers.forEach((browser) => {
            if (browser.active) {
                mp.console.logWarning(`Мы отправляем на CEF: ${eventName}`);
                browser.execute(`window.customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`);
            }
        });
    }
    static forceTriggerCef(eventName, ...args) {
        mp.browsers.forEach(browser => {
            browser.execute(`window.customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`);
        });
    }
    static registerServer(eventName, handle) {
        if (!this.registerServerEvents.has(eventName)) {
            this.registerServerEvents.set(eventName, new Set());
        }
        this.registerServerEvents.get(eventName).add(handle);
    }
    static registerAll(name, handle) {
        this.registerServer(name, handle);
        CustomEventBase.register(name, handle);
        // Также регистрируем для обработки событий из CEF
        if (!this.cefHandlers.has(name)) {
            this.cefHandlers.set(name, new Set());
        }
        this.cefHandlers.get(name).add(handle);
    }
    // Метод для вызова событий из CEF
    static triggerFromCef(eventName, ...args) {
        const handlers = this.cefHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(...args);
                }
                catch (error) {
                    mp.console.logError(`Error in CEF event ${eventName}: ${error}; ${args}`);
                }
            });
        }
    }
}
mp.events.add('triggerFromCef', (eventName, ...args) => {
    rce.triggerFromCef(eventName, ...args);
});
mp.events.add("client:trigger:event", (eventname, argsstring) => triggerEvent(eventname, argsstring));
let enableEventsLogging = mp.storage.data.enableEventsLoggin;
const eventsCountMap = new Map();
const triggerEvent = async (eventname, argsstring) => {
    if (!eventsCountMap.has(eventname)) {
        eventsCountMap.set(eventname, 0);
    }
    eventsCountMap.set(eventname, (eventsCountMap.get(eventname) + 1));
    const handlers = rce.registerServerEvents.get(eventname);
    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering started: ${eventname}`);
    }
    if (!handlers || handlers.size === 0)
        return mp.console.logError("[CustomEvent] trigger non exists event " + eventname, true);
    handlers.forEach(handler => {
        try {
            handler(...(JSON.parse(argsstring)));
        }
        catch (error) {
            if (enableEventsLogging) {
                mp.console.logError(`event (${eventname}) catch an error: ${error}`);
            }
        }
    });
    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering ended: ${eventname}`);
    }
};
let splitTrigger = new Map();
mp.events.add("client:trigger:event:split", async (tid, index, last, eventname, argsstring) => {
    const handlers = rce.registerServerEvents.get(eventname);
    if (!handlers || handlers.size === 0)
        return mp.console.logError("[CustomEvent] trigger split non exists event " + eventname, true);
    if (!splitTrigger.has(`${tid}_${eventname}`)) {
        splitTrigger.set(`${tid}_${eventname}`, []);
    }
    let d = splitTrigger.get(`${tid}_${eventname}`);
    d[index] = argsstring;
    if (last) {
        triggerEvent(eventname, d.join(''));
    }
    else {
        splitTrigger.set(`${tid}_${eventname}`, d);
    }
});
mp.events.add('__cefResponse', (id, result) => {
    let parsedResult;
    try {
        parsedResult = JSON.parse(result);
    }
    catch (e) {
        parsedResult = ['error'];
    }
    rce.handleCefResponse(id, parsedResult);
});
mp.events.add("client:call:event", async (eventname, requestID, argsstring) => {
    try {
        const handlers = rce.registerServerEvents.get(eventname);
        if (!handlers || handlers.size === 0) {
            mp.events.callRemote('client:call:event:result', requestID, null);
            return;
        }
        // Вызываем первый обработчик (для обратной совместимости)
        const handler = Array.from(handlers)[0];
        let res = await handler(...(JSON.parse(argsstring)));
        mp.events.callRemote('client:call:event:result', requestID, res);
    }
    catch (error) {
        mp.console.logError(error, true);
    }
});
mp.events.add('cef:trigger:event', (eventName, args) => {
    rce.triggerCef(eventName, ...JSON.parse(args));
});
mp.events.add('call:client:response', (requestID, res) => {
    let resolve = rce.requestServerHandle.get(requestID);
    if (!resolve)
        return;
    resolve(res);
});
mp.events.add('call:cef:response', (requestID, res) => {
    mp.browsers.forEach((browser) => {
        browser.execute(`window.customevent.callServerResponseHandle(${requestID}, '${JSON.stringify(res)}');`);
    });
});
mp.events.add('call:server', (requestID, eventName, ...args) => mp.events.callRemote('call:cef', requestID, rce.encryptEventName(eventName), ...args));
mp.events.add('trigger:server', (name, args) => {
    mp.events.callRemote('trigger:cef', rce.encryptEventName(name), args);
});
mp.events.add('call:clientfromcef', async (requestID, eventName, ...args) => {
    try {
        const result = await CustomEventBase.call(eventName, ...args);
        mp.browsers.forEach((browser) => {
            if (browser.active) {
                browser.execute(`window.customevent.callClientResponseHandle(${requestID}, ${JSON.stringify(result)})`);
            }
        });
    }
    catch (error) {
        mp.browsers.forEach((browser) => {
            if (browser.active) {
                browser.execute(`window.customevent.callClientResponseHandle(${requestID}, null)`);
            }
        });
    }
});

const maxDistance = 20 * 20;
let width = 0.032;
const height = 0.006;
let visibleNametags = true;
let playerAimAt = null;
const playerSids = new Map();
mp.nametags.enabled = false;
const requestPlayerSid = async (player) => {
    const statID = await rce.callServer('getDataAccount', ['sid'], player.remoteId);
    playerSids.set(player.remoteId, statID);
};
mp.keys.bind(Keys.VK_F9, false, () => {
    visibleNametags = !visibleNametags;
});
mp.events.add('render', (nametags) => {
    const graphics = mp.game.graphics;
    graphics.getScreenResolution();
    playerAimAt = mp.game.player.getEntityIsFreeAimingAt();
    mp.players.local;
    if (visibleNametags) {
        nametags.forEach(nametag => {
            let [player, x, y, distance] = nametag;
            const sid = playerSids.get(player.remoteId);
            if (global.loginPlayer && (sid === null || sid === undefined)) {
                requestPlayerSid(player);
            }
            if (distance <= maxDistance) {
                const distanceFactor = Math.min(1, distance / maxDistance);
                const liftAmount = 0.04 * distanceFactor;
                const textScale = Math.max(0.7, 1 - distanceFactor * 0.3);
                const textY = y - liftAmount;
                mp.game.graphics.drawText(`Гражданин #${sid}`, [x, textY + 0.05], {
                    font: 0,
                    color: [255, 255, 255, distance > 15 * 15 ? 180 : 255],
                    scale: [textScale * 0.25, textScale * 0.25],
                    outline: true
                });
                mp.game.graphics.drawText(`(ID: ${player.remoteId})`, [x, textY + 0.03], {
                    font: 0,
                    color: [255, 255, 255, distance > 15 * 15 ? 180 : 255],
                    scale: [textScale * 0.25, textScale * 0.25],
                    outline: true
                });
                if (player.getVariable('player_knockout')) {
                    drawSprite('commonmenutu', 'team_deathmatch', [player.isVoiceActive ? x + 0.006 : x, textY + 0.018], [textScale * 0.8, textScale * 0.8], 0, [255, 13, 74, 255]);
                    mp.game.graphics.drawText('Без сознания...', [x, textY + 0.073], {
                        font: 4,
                        color: [255, 13, 74, 255],
                        scale: [textScale * 0.35, textScale * 0.35],
                        outline: true
                    });
                }
                if (player.getVariable('player_mute'))
                    return drawSprite('mpleaderboard', 'leaderboard_audio_mute', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255]);
                if (player.isVoiceActive) {
                    if (distance > 15 * 15) {
                        drawSprite('mpleaderboard', 'leaderboard_audio_1', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255]);
                    }
                    else if (distance < 15 * 15 && distance > 10 * 10) {
                        drawSprite('mpleaderboard', 'leaderboard_audio_2', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255]);
                    }
                    else if (distance < 10 * 10) {
                        drawSprite('mpleaderboard', 'leaderboard_audio_3', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255]);
                    }
                }
                if (playerAimAt !== undefined && !player.getVariable('player_knockout')) {
                    const healthBarY = textY + 0.08;
                    let health = player.getHealth();
                    let armour = player.getArmour() / 100;
                    let x2 = x - width / 2;
                    health = health <= 100 ? health / 100 : (health - 100) / 100;
                    if (armour <= 0) {
                        mp.game.graphics.drawRect(x, healthBarY, width, height, 81, 80, 80, 255, false);
                        mp.game.graphics.drawRect(x - width / 2 * (1 - health), healthBarY, width * health, height, 0, 255, 128, 255, false);
                    }
                    else {
                        width = 0.025;
                        mp.game.graphics.drawRect(x2, healthBarY, width, height, 81, 80, 80, 255, false);
                        mp.game.graphics.drawRect(x2 - width / 2 * (1 - health), healthBarY, width * health, height, 0, 255, 128, 255, false);
                        x2 = (x + width / 2) + 0.002;
                        mp.game.graphics.drawRect(x2, healthBarY, width, height, 81, 80, 80, 255, false);
                        mp.game.graphics.drawRect(x2 - width / 2 * (1 - armour), healthBarY, width * armour, height, 0, 132, 255, 255, false);
                    }
                }
            }
        });
    }
});
mp.events.add('playerJoin', (player) => {
    requestPlayerSid(player);
});
mp.events.add('playerQuit', (player) => {
    playerSids.delete(player.remoteId);
});

const showLoading = (duration) => {
    setTimeout(() => {
        mp.gui.cursor.show(false, false);
        mp.gui.cursor.visible = false;
    }, 500);
    gui.execute(`window.App.loadingReducer.showLoading(${duration})`);
    mp.game.graphics.triggerScreenblurFadeIn(1000);
    mp.game.graphics.isScreenblurFadeRunning();
    mp.game.audio.playSoundFrontend(0, 'slow', 'SHORT_PLAYER_SWITCH_SOUND_SET', true);
    setTimeout(() => {
        mp.game.graphics.triggerScreenblurFadeOut(1000);
        mp.game.audio.stopSound(0);
    }, duration);
};
rce.register('client:showLoading', showLoading);

let camera$1 = null;
const enableAuth = () => {
    //mp.game.time.setClockTime(6, 0, 0)
    mp.game.gameplay.setWeatherTypePersist('CLEAR');
    rce.trigger('execute', `window.App.authReducer.showAuth()`);
    rce.triggerServer('client:authPlayerVisible', false);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.disableScreenblurFade();
    rce.triggerServer('setPosChar', -1487.7098, 2274.3295, 32.5487, 153.0708);
    camera$1 = mp.cameras.new('default', new mp.Vector3(-1391.9077, 2417.4196, 58.210), new mp.Vector3(0, 0, 150.2362), 45);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    //mp.players.local.freezePosition(true)
    mp.gui.cursor.visible = true;
    if (mp.storage.data.auth !== undefined) {
        rce.triggerCef('client:auth:saveLogin', mp.storage.data.auth.login);
    }
    rce.registerServer('server:auth:saveLogin', (login) => {
        mp.storage.data.auth = {
            login: login
        };
        mp.storage.flush();
    });
};
const disableAuth = () => {
    showLoading(1500);
    gui.execute('window.App.authReducer.hideAuth()');
    mp.console.logInfo('Закрываем авторизацию');
    rce.triggerServer('client:authPlayerVisible', true);
    if (camera$1 && mp.cameras.exists(camera$1)) {
        camera$1.destroy();
    }
};
rce.registerAll('cef:authEnabled', () => {
    enableAuth();
});
rce.registerAll('cef:authDisabled', async () => {
    disableAuth();
    const statID = await rce.callServer('getDataAccount', 'sid', mp.players.local.remoteId);
    rce.trigger('execute', `window.App.playerInfoReducer.setSid(${statID})`);
    global.loginPlayer = true;
});

rce.registerAll('sendNotify', (typeNotify, msg, duration, pos) => {
    const safeMsg = JSON.stringify(msg);
    const safeTypeNotify = JSON.stringify(typeNotify);
    const safeDuration = duration !== undefined ? duration : 4000;
    const safePos = pos !== undefined ? JSON.stringify(pos) : 'bottom';
    const code = `window.App.sendNotifyReducer.sendNotify(
    ${safeTypeNotify}, 
    ${safeMsg}, 
    ${safeDuration}, 
    ${safePos}
  )`;
    gui.execute(code);
});

mp.events.add('browserDomReady', async (player) => {
    gui.execute('window.App.welcomeReducer.showWelcome()');
    mp.gui.cursor.visible = true;
    await setTimeout(() => {
        rce.trigger('cef:authEnabled');
        setTimeout(() => {
            gui.execute('window.App.welcomeReducer.hideWelcome()');
        }, 200);
    }, 5100);
});

const CHAT_MESSAGE_EVENT = 'chat:message';
const buffer = [];
let loaded = false;
let opened = false;
global.chatOpened = false;
const toggleChat = (state) => {
    rce.triggerCef('chatActive', state);
};
const addMsg = (name, text, showTime, tile) => {
    if (name) {
        rce.triggerCef('addMsg', name, text, showTime, tile);
    }
    else {
        rce.triggerCef('addString', text, showTime, tile);
    }
};
rce.registerAll('chatloaded', () => {
    for (const msg of buffer) {
        addMsg(msg.name, msg.text, msg.showTime, msg.tile);
    }
    loaded = true;
});
rce.registerAll('chatmessage', (text) => {
    rce.triggerServer(CHAT_MESSAGE_EVENT, text);
    toggleChat(true);
    opened = true;
});
const pushMsg = (name, text, showTime, tile) => {
    if (!loaded) {
        buffer.push({ name, text, showTime, tile });
    }
    else {
        addMsg(name, text, showTime, tile);
        buffer.push({ name, text, showTime, tile });
    }
};
const pushLine = (text, showTime, tile) => {
    pushMsg(null, text, showTime, tile);
};
const clearChat = () => {
    if (buffer) {
        buffer.length = 0;
        rce.triggerCef('client:clearChat');
    }
};
rce.registerAll(CHAT_MESSAGE_EVENT, pushMsg);
rce.registerAll('clearChat', () => {
    clearChat();
});
mp.keys.bind(Keys.VK_T, false, () => {
    if (loaded && !opened) {
        opened = true;
        toggleChat(true);
        global.chatOpened = true;
        rce.triggerCef('openChat', false);
    }
});
mp.keys.bind(Keys.VK_OEM_2, false, () => {
    if (loaded && !opened) {
        opened = true;
        toggleChat(true);
        rce.triggerCef('openChat', true);
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (loaded && opened) {
        opened = false;
        global.chatOpened = false;
        rce.triggerCef('closeChat');
        toggleChat(false);
    }
});
mp.keys.bind(Keys.VK_ENTER, false, () => {
    if (loaded && opened) {
        opened = false;
        global.chatOpened = false;
        rce.triggerCef('closeChat');
        toggleChat(false);
    }
});
rce.registerAll('chat:pushMsg', (name, text, showTime, tile) => {
    pushMsg(name, text, showTime, tile);
});
rce.registerAll('chat:pushLine', (text, showTime, tile) => {
    pushLine(text, showTime, tile);
});
pushLine(`<b>Ваше приключение начинается на ⚡️ {FCD53F}REAL ROLEPLAY!</b>`, false, 'hello');

let area;
let street;
const lcplayer$3 = mp.players.local;
mp.game.ui.setRadarZoom(1.0);
mp.game.ui.setRadarBigmapEnabled(false, false);
const showHud = () => {
    const pl = mp.players.local;
    const minimap = getMinimapAnchor();
    const isDriver = !!(pl.vehicle && pl.vehicle.getPedInSeat(-1) === pl.handle);
    gui.execute(`
    window.App.hudReducer.showHud(
      ${isDriver},
      ${minimap.rightX * 100}, ${minimap.leftX * 100},
      ${minimap.topY * 100}, ${minimap.bottomY * 100},
      ${minimap.width * 100}, ${minimap.height * 100}
    )
  `);
};
rce.registerAll('showHud', () => {
    showHud();
});
const getMinimapAnchor = () => {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;
    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };
    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
};
mp.events.add('render', () => {
    const currentArea = mp.game.zone.getNameOfZone(lcplayer$3.position.x, lcplayer$3.position.y, lcplayer$3.position.z);
    const currentStreet = mp.game.pathfind.getStreetNameAtCoord(lcplayer$3.position.x, lcplayer$3.position.y, lcplayer$3.position.z);
    if (currentArea !== area || currentStreet !== street) {
        area = currentArea;
        street = currentStreet;
        gui.execute(`window.App.hudReducer.setArea('${mp.game.ui.getLabelText(currentArea)}')`);
        gui.execute(`window.App.hudReducer.setStreet('${mp.game.ui.getStreetNameFromHashKey(currentStreet.streetName)}')`);
    }
});

let visibleAMenu$1 = false;
const plLocal = mp.players.local;
mp.keys.bind(Keys.VK_OEM_3, false, () => {
    if (!visibleAMenu$1 && plLocal.getVariable('player_spawned') === true && plLocal.getVariable('ADMIN_LVL') > 0) {
        rce.trigger('openAMenu');
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (visibleAMenu$1) {
        rce.trigger('closeAMenu');
    }
});
mp.keys.bind(Keys.VK_NUMPAD4, false, () => {
    if (visibleAMenu$1) {
        rce.triggerCef('amenu:ctrlPress', 'left');
    }
});
mp.keys.bind(Keys.VK_NUMPAD6, false, () => {
    if (visibleAMenu$1) {
        rce.triggerCef('amenu:ctrlPress', 'right');
    }
});
rce.registerAll('openAMenu', () => {
    visibleAMenu$1 = true;
    gui.execute(`window.App.adminMenuReducer.showAdminMenu()`);
    gui.execute(`window.App.chatReducer.hideChat()`);
    gui.execute(`window.App.hudReducer.hideHud()`);
    mp.game.ui.displayRadar(false);
    mp.game.ui.setPauseMenuActive(false);
    mp.gui.cursor.show(true, true);
});
rce.registerAll('closeAMenu', () => {
    visibleAMenu$1 = false;
    gui.execute(`window.App.adminMenuReducer.hideAdminMenu()`);
    gui.execute(`window.App.chatReducer.showChat()`);
    showHud();
    mp.game.ui.displayRadar(true);
    mp.game.ui.setPauseMenuActive(true);
    mp.gui.cursor.show(false, false);
});

let visibleAMenu = false;
mp.keys.bind(Keys.VK_F6, false, () => {
    if (!visibleAMenu) {
        rce.trigger('cef:openReportMenu');
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (visibleAMenu) {
        rce.trigger('cef:closeReportMenu');
    }
});
rce.registerAll('cef:openReportMenu', () => {
    visibleAMenu = true;
    gui.execute(`window.App.playerReportsReducer.showPlayerReports()`);
    gui.execute(`window.App.chatReducer.hideChat()`);
    gui.execute(`window.App.hudReducer.hideHud()`);
    mp.game.ui.displayRadar(false);
    mp.game.ui.setPauseMenuActive(false);
    mp.gui.cursor.show(true, true);
});
rce.registerAll('cef:closeReportMenu', () => {
    visibleAMenu = false;
    gui.execute(`window.App.playerReportsReducer.hidePlayerReports()`);
    gui.execute(`window.App.chatReducer.showChat()`);
    showHud();
    mp.game.ui.displayRadar(true);
    mp.game.ui.setPauseMenuActive(true);
    mp.gui.cursor.show(false, false);
});

let inventoryVisible = false;
const showInventory = async (tradeOpen) => {
    inventoryVisible = true;
    const haveDonatSlots = await rce.callServer('existenceDonatSlots');
    const health = mp.players.local.getHealth();
    gui.execute(`window.App.playerInfoReducer.setHealth(${health})`);
    gui.execute(`window.App.inventoryReducer.showInventory(${haveDonatSlots}, ${tradeOpen})`);
    gui.execute(`window.App.hudReducer.hideHud()`);
    gui.execute(`window.App.chatReducer.hideChat()`);
    mp.game.ui.displayRadar(false);
    mp.gui.cursor.visible = true;
};
const hideInventory = () => {
    inventoryVisible = false;
    rce.triggerCef('fadeCloseInventory');
    setTimeout(() => {
        gui.execute(`window.App.inventoryReducer.hideInventory()`);
        showHud();
        gui.execute(`window.App.chatReducer.showChat()`);
        mp.game.ui.displayRadar(true);
        mp.gui.cursor.visible = false;
    }, 500);
};
mp.keys.bind(Keys.VK_TAB, false, async () => {
    if (!inventoryVisible) {
        const openedMenus = await rce.callCef('getOpenMenus');
        const specialMenus = ['Welcome', 'Auth', 'SelectChar', 'Spawn', 'CreateChar', 'Loading', 'Rent'];
        const hasSpecialOpen = openedMenus.some(menu => specialMenus.includes(menu));
        if (!hasSpecialOpen) {
            showInventory();
        }
    }
    else {
        hideInventory();
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (inventoryVisible) {
        hideInventory();
    }
});
rce.registerAll('showInventory', (tradeOpen) => {
    showInventory(tradeOpen);
});
rce.registerAll('hideInventory', () => {
    hideInventory();
});
// Колесо оружия
mp.events.add('render', () => {
    mp.game.controls.disableControlAction(0, 12, true);
    mp.game.controls.disableControlAction(0, 14, true);
    mp.game.controls.disableControlAction(0, 15, true);
    mp.game.controls.disableControlAction(0, 16, true);
    mp.game.controls.disableControlAction(0, 17, true);
    mp.game.controls.disableControlAction(0, 37, true);
    mp.game.controls.disableControlAction(0, 53, true);
    mp.game.controls.disableControlAction(0, 54, true);
    mp.game.controls.disableControlAction(0, 56, true);
    mp.game.controls.disableControlAction(0, 99, true);
    mp.game.controls.disableControlAction(0, 115, true);
    mp.game.controls.disableControlAction(0, 116, true);
    mp.game.controls.disableControlAction(0, 157, true);
    mp.game.controls.disableControlAction(0, 158, true);
    mp.game.controls.disableControlAction(0, 159, true);
    mp.game.controls.disableControlAction(0, 160, true);
    mp.game.controls.disableControlAction(0, 161, true);
    mp.game.controls.disableControlAction(0, 162, true);
    mp.game.controls.disableControlAction(0, 163, true);
    mp.game.controls.disableControlAction(0, 164, true);
    mp.game.controls.disableControlAction(0, 165, true);
    mp.game.controls.disableControlAction(0, 261, true);
    mp.game.controls.disableControlAction(0, 262, true);
    mp.game.controls.disableControlAction(0, 100, true);
});

rce.registerServer('openDevMenu', () => {
    mp.gui.cursor.visible = true;
    mp.game.ui.displayRadar(false);
    mp.game.graphics.triggerScreenblurFadeIn(1000);
    mp.game.graphics.isScreenblurFadeRunning();
    gui.execute('window.App.hudReducer.hideHud()');
});
rce.registerAll('closeDevMenu', () => {
    mp.gui.cursor.visible = false;
    mp.game.ui.displayRadar(true);
    mp.game.graphics.triggerScreenblurFadeOut(1000);
    showHud();
});

mp.events.add('guiReady', () => {
    mp.gui.chat.show(false);
    gui.browser.active = true;
    rce.registerAll('execute', (commands) => {
        const commandsArray = Array.isArray(commands) ? commands : [commands];
        mp.browsers.forEach(browser => {
            if (browser && browser.execute) {
                try {
                    commandsArray.forEach(code => {
                        mp.console.logInfo(code);
                        gui.execute(code);
                    });
                }
                catch (e) {
                    mp.console.logError(`Ошибка выполнения кода в браузере: ${e}`);
                }
            }
        });
    });
});
mp.keys.bind(Keys.VK_F2, false, () => {
    mp.gui.cursor.visible = !mp.gui.cursor.visible;
});
rce.registerAll('clientCmd', (text) => {
    mp.console.logInfo(`[CEF]: ${text}`);
});
rce.registerAll('cef:setActiveAmbient', (toggle) => {
    mp.storage.data.activeAmbient = toggle;
    mp.storage.flush();
});
rce.registerAll('cef:changeLanguage', (lang) => {
    mp.storage.data.language = lang;
    mp.storage.flush();
});
rce.registerAll('cursorVisible', (toggle) => {
    mp.gui.cursor.visible = toggle;
});
const gui = {
    browser: mp.browsers.new('package://cef/index.html'),
    execute: (command) => {
        if (mp.browsers.exists(gui.browser) && gui.browser.active) {
            gui.browser.execute(command);
        }
    }
};

const lcplayer$2 = mp.players.local;
mp.keys.bind(Keys.VK_F7, true, () => {
    mp.players.local.setArmour(100);
});
const getRandomChance = () => {
    const percent = Math.floor(Math.random() * 40);
    const luck = Math.random() * 100 < percent;
    return [percent, luck];
};
mp.events.add('playerDeath', async (player, reason, killer) => {
    const [chance, luck] = getRandomChance();
    let killerName = null;
    let killerSid = null;
    const playerPos = lcplayer$2.position;
    const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false);
    if (killer) {
        killerName = await rce.callServer('dataOnlineUser:getField', killer.id, 'nickName');
        killerSid = await rce.callServer('dataOnlineUser:getField', killer.id, 'sid');
    }
    rce.triggerServer('playerKnockout');
    rce.triggerServer('client:playerDeath', [player.position.x, player.position.y, getGroundZ]);
    const killerInfo = (killerName && killerSid) !== null ? `${killerName} #${killerSid}` : '';
    gui.execute(`window.App.deathReducer.showDeath('${killerInfo}', null)`);
    gui.execute(`window.App.chatReducer.hideChat()`);
    gui.execute(`window.App.hudReducer.hideHud()`);
    rce.triggerCef('client:chanceReborn', chance, luck);
    if (!lcplayer$2.vehicle)
        lcplayer$2.setCollision(false, false);
    lcplayer$2.freezePosition(true);
    lcplayer$2.setInvincible(true);
    mp.gui.cursor.visible = true;
    mp.game.ui.setPauseMenuActive(false);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.startScreenEffect('DeathFailMPIn', 0, true);
});
const playerRevive = (type) => {
    if (type === 'reborn')
        rce.triggerServer('playerReborn');
    else
        rce.triggerServer('playerKill');
    gui.execute(`window.App.chatReducer.showChat()`);
    gui.execute(`window.App.deathReducer.hideDeath()`);
    lcplayer$2.freezePosition(false);
    lcplayer$2.setInvincible(false);
    mp.gui.cursor.visible = false;
    mp.game.ui.setPauseMenuActive(true);
    mp.game.ui.displayRadar(true);
    mp.game.graphics.stopAllScreenEffects();
    showHud();
    if (lcplayer$2.isCollisonDisabled())
        lcplayer$2.setCollision(true, true);
};
rce.registerAll('playerRevive', (type) => {
    playerRevive(type);
});
rce.registerAll('cef:death:selectedFate', () => {
    mp.gui.cursor.visible = false;
});

// PLAYER
rce.registerServer('player:freeze', (toggle) => {
    mp.players.local.freezePosition(toggle);
});
rce.registerServer('player:isCollision', (toggle) => {
    mp.players.local.setCollision(toggle, toggle);
});
rce.registerServer('player:godmode', (toggle) => {
    mp.players.local.setInvincible(toggle);
});
// GRAPHICS
rce.registerServer('graphics:startScreenEffect', (name, duration, looped) => {
    mp.game.graphics.startScreenEffect(name, duration, looped);
});
rce.registerServer('graphics:stopAllScreenEffects', () => {
    mp.game.graphics.stopAllScreenEffects();
});
// UI
rce.registerServer('ui:displayRadar', (toggle) => {
    mp.game.ui.displayRadar(toggle);
});
rce.registerServer('ui:setPauseMenuActive', (toggle) => {
    mp.game.ui.setPauseMenuActive(toggle);
});
// GUI
rce.registerServer('gui:cursorVisible', (toggle) => {
    mp.gui.cursor.visible = toggle;
});
rce.registerServer('getId', () => {
    return mp.players.local.remoteId;
});

mp.events.add('playerReady', (player) => {
    rce.triggerCef('client:setActiveAmbient', mp.storage.data.activeAmbient);
    mp.game.gameplay.setFadeOutAfterDeath(false);
    mp.game.ui.displayCash(false);
    mp.game.ui.displayAreaName(false);
    mp.game.ui.displayAmmoThisFrame(false);
    gui.execute(`window.App.playerInfoReducer.setID(${mp.players.local.remoteId})`);
    if (mp.storage.data.language !== undefined) {
        rce.triggerCef('client:setLanguage', mp.storage.data.language);
    }
    else {
        rce.triggerCef('client:setLanguage', 'ru');
    }
});

mp.keys.bind(Keys.VK_TAB, false, () => {
    rce.triggerServer('changeAnim');
});
global.noclip = {
    active: false,
    shiftBoost: false,
    ctrlSlowing: false,
    f: 2.0,
    w: 2.0,
    h: 2.0,
    point_distance: 1000,
    speed: 0.15
};
const ids = {
    W: 32,
    S: 33,
    A: 34,
    D: 35,
    Space: 321,
    Shift: 340,
    LCtrl: 326,
    RMB: 25
};
let ev$1 = null;
const localplayer$1 = mp.players.local;
const noclip = global.noclip;
const camera = mp.cameras.new('gameplay');
const controls = mp.game.controls;
let direction = null;
const startNoclip = () => {
    rce.triggerServer('toggleNoclip', true);
    if (ev$1) {
        ev$1.destroy();
        ev$1 = null;
    }
    ev$1 = new mp.Event("render", () => {
        if (noclip.active) {
            let updated = false;
            const pos = mp.players.local.position;
            direction = camera.getDirection();
            camera.getCoord();
            const heading = Math.atan2(direction.x, direction.y) * (180 / Math.PI);
            mp.players.local.setRotation(0, 0, heading, 2, true);
            if (controls.isControlPressed(0, ids.Shift))
                noclip.speed = 1.0;
            else if (controls.isControlPressed(0, ids.RMB))
                noclip.speed = 0.02;
            else
                noclip.speed = 0.15;
            if (controls.isControlPressed(0, ids.W)) {
                if (noclip.f < 8.0)
                    noclip.f *= 1.025;
                pos.x += direction.x * noclip.f * noclip.speed;
                pos.y += direction.y * noclip.f * noclip.speed;
                pos.z += direction.z * noclip.f * noclip.speed;
                updated = true;
            }
            else if (controls.isControlPressed(0, ids.S)) {
                if (noclip.f < 8.0)
                    noclip.f *= 1.025;
                pos.x -= direction.x * noclip.f * noclip.speed;
                pos.y -= direction.y * noclip.f * noclip.speed;
                pos.z -= direction.z * noclip.f * noclip.speed;
                updated = true;
            }
            else
                noclip.f = 2.0;
            if (controls.isControlPressed(0, ids.A)) {
                if (noclip.l < 8.0)
                    noclip.l *= 1.025;
                pos.x += (-direction.y) * noclip.l * noclip.speed;
                pos.y += direction.x * noclip.l * noclip.speed;
                updated = true;
            }
            else if (controls.isControlPressed(0, ids.D)) {
                if (noclip.l < 8.0)
                    noclip.l *= 1.05;
                pos.x -= (-direction.y) * noclip.l * noclip.speed;
                pos.y -= direction.x * noclip.l * noclip.speed;
                updated = true;
            }
            else
                noclip.l = 2.0;
            if (controls.isControlPressed(0, ids.Space)) {
                if (noclip.h < 8.0)
                    noclip.h *= 1.025;
                pos.z += noclip.h * noclip.speed;
                updated = true;
            }
            else if (controls.isControlPressed(0, ids.LCtrl)) {
                if (noclip.h < 8.0)
                    noclip.h *= 1.05;
                pos.z -= noclip.h * noclip.speed;
                updated = true;
            }
            else
                noclip.h = 2.0;
            if (updated)
                mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false);
        }
    });
};
const stopNoclip = () => {
    rce.triggerServer('toggleNoclip', false);
    if (ev$1) {
        ev$1.destroy();
        ev$1 = null;
    }
    noclip.f = 2.0;
    noclip.w = 2.0;
    noclip.h = 2.0;
    noclip.speed = 0.15;
};
mp.keys.bind(Keys.VK_F8, false, () => {
    if (!global.loginPlayer)
        return;
    if (localplayer$1.getVariable('ADMIN_LVL') < 1)
        return;
    noclip.active = !noclip.active;
    direction = camera.getDirection();
    camera.getCoord();
    localplayer$1.setInvincible(noclip.active);
    localplayer$1.freezePosition(noclip.active);
    localplayer$1.setCollision(!noclip.active, !noclip.active);
    rce.trigger('sendNotify', 'info', noclip.active ? 'Полёт включен' : 'Полёт отключен', 1200, 'top');
    if (!noclip.active && !controls.isControlPressed(0, ids.Space)) {
        const pos = mp.players.local.position;
        pos.z = mp.game.gameplay.getGroundZFor3DCoord(pos.x, pos.y, pos.z, true, false);
        mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false);
    }
    if (noclip.active) {
        startNoclip();
    }
    else {
        stopNoclip();
    }
});

const maxDist = 10.0;
rce.registerAll('mutePlayer', (toogle) => {
    global.mutePlayer = toogle;
});
mp.keys.bind(Keys.VK_B, true, () => {
    if (global.chatOpened || !global.loginPlayer)
        return;
    if (mp.players.local.getVariable('player_mute'))
        return rce.trigger('chat:pushLine', '{FF2701}<b>У вас бан-войс!</b>');
    mp.voiceChat.muted = false;
    global.activeVoice = true;
    mp.players.local.playFacialAnim("mic_chatter", "mp_facial");
    gui.execute('window.voiceComponent.enable()');
});
mp.keys.bind(Keys.VK_B, false, () => {
    mp.voiceChat.muted = true;
    global.activeVoice = false;
    mp.players.local.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
    gui.execute('window.voiceComponent.disable()');
});
mp.keys.bind(Keys.VK_F10, false, () => {
    mp.voiceChat.muted = true;
    setTimeout(() => {
        if (!mp.voiceChat.muted)
            return;
        else {
            mp.voiceChat.cleanupAndReload(true, true, true);
            gui.execute(`window.App.sendNotifyReducer.sendNotify('success', 'Войс-чат был успешно перезагружен!', 3000, 'bottom')`);
        }
    }, 100);
});
let voiceManager = {
    list: [],
    new(player) {
        if (this.list.indexOf(player) === -1) {
            rce.triggerServer('client:voice:new', player.remoteId);
            this.list.push(player);
            {
                player.voiceVolume = 1.0;
            }
            {
                player.voice3d = true;
            }
        }
    },
    delete(player, removedVoice) {
        let index = this.list.indexOf(player);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
        if (removedVoice) {
            rce.triggerServer('client:voice:deleted', player.remoteId);
        }
    }
};
mp.events.add('playerQuit', (player) => {
    if (player.isListening) {
        voiceManager.delete(player, false);
    }
});
mp.events.add('playerStartTalking', (player) => {
    if (!player || !mp.players.exists(player) || player.type !== 'player')
        return;
    player.playFacialAnim("mic_chatter", "mp_facial");
});
mp.events.add('playerStopTalking', (player) => {
    if (!player || !mp.players.exists(player) || player.type !== 'player')
        return;
    player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
});
rce.registerServer('player:mute', (state) => {
    rce.triggerServer('player:mute', state);
    mp.voiceChat.muted = true;
    if (state) {
        gui.execute('window.voiceComponent.disabled()');
    }
    else {
        gui.execute('window.voiceComponent.enabled()');
    }
});
setInterval(() => {
    let localplayer = mp.players.local;
    let localPos = localplayer.position;
    mp.players.forEachInStreamRange((player) => {
        if (player !== localplayer && !player.isListening) {
            const playerPos = player.position;
            let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
            if (dist <= maxDist) {
                mp.console.logWarning(`${voiceManager.list}`);
                voiceManager.new(player);
            }
        }
    });
    voiceManager.list.forEach((player) => {
        if (player.handle !== 0) {
            const playerPos = player.position;
            let dist = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, localPos.x, localPos.y, localPos.z);
            if (dist > maxDist) {
                voiceManager.delete(player, true);
            }
            else {
                player.voiceVolume = 1.0 - (dist / maxDist);
            }
        }
        else {
            voiceManager.delete(player, true);
        }
    });
}, 500);

const getDist = (x1, y1, z1, x2, y2, z2) => {
    mp.game.system.vdist(x1, y1, z1, x2, y2, z2);
};
rce.registerAll('getDist', (x1, y1, z1, x2, y2, z2) => {
    return getDist(x1, y1, z1, x2, y2, z2);
});

const scenarios$1 = [
    "WORLD_HUMAN_AA_COFFEE",
    "WORLD_HUMAN_CAR_PARK_ATTENDANT",
    "WORLD_HUMAN_CLIPBOARD_FACILITY",
    "WORLD_HUMAN_COP_IDLES",
    "WORLD_HUMAN_DRINKING_FACILITY",
    "WORLD_HUMAN_GUARD_STAND",
    "WORLD_HUMAN_STAND_MOBILE",
    "EAR_TO_TEXT_FAT",
    "WORLD_LOOKAT_POINT",
    "WORLD_HUMAN_AA_SMOKE",
];
let pedsData = new Map();
mp.events.add('entityStreamIn', (entity) => {
    if (entity && entity.handle !== 0 && entity.type === 'ped') {
        const pedData = pedsData.get(entity.id);
        if (pedData && pedData.scenario) {
            entity.taskStartScenarioInPlace(pedData.scenario, 0, false);
        }
    }
});
rce.registerAll('createPed', (pedName, pedRole, modelName, pedPos, blip) => {
    const [x, y, z, heading] = pedPos;
    const npc = mp.peds.new(mp.game.joaat(modelName), new mp.Vector3(x, y, z), heading, 0);
    const scenario = scenarios$1[Math.floor(Math.random() * scenarios$1.length)];
    pedsData.set(npc.id, {
        scenario: scenario,
        name: pedName,
        role: pedRole
    });
    mp.labels.new(pedName, new mp.Vector3(x, y, z + 1.2), { los: false, font: 4, drawDistance: 7.5, color: [255, 255, 255, 255], dimension: 0 });
    mp.labels.new(pedRole, new mp.Vector3(x, y, z + 1.05), { los: false, font: 4, drawDistance: 7.5, color: [255, 102, 37, 255], dimension: 0 });
    mp.labels.new('[E]', new mp.Vector3(x, y, z + 0.2), { los: false, font: 4, drawDistance: 3, color: [21, 255, 146, 190], dimension: 0 });
    mp.markers.new(23, new mp.Vector3(x, y, z - 0.95), 1, {
        direction: new mp.Vector3(x, y, z),
        rotation: new mp.Vector3(0, 0, 0),
        color: [255, 255, 255, 255],
        dimension: 0,
        visible: true
    });
    if (blip.isVisible) {
        mp.blips.new(blip.id, new mp.Vector3(x, y, z), {
            name: pedRole,
            scale: 0.8,
            color: blip.color,
            alpha: 255,
            drawDistance: 100,
            shortRange: true,
            rotation: 0,
            dimension: 0
        });
    }
});

const listCameras = [
    {
        playerPos: { x: -142.221, y: -599.458, z: 211.775, heading: 30.8 },
        cameraPos: { x: -143.5, y: -596.5199, z: 211.9750, heading: 203 }
    },
    {
        playerPos: { x: -149.2261, y: -598.8834, z: 211.9750, heading: -43 },
        cameraPos: { x: -147.2369, y: -596.2113, z: 211.9750, heading: 142 }
    },
    {
        playerPos: { x: -151.7817, y: -594.1783, z: 211.9750, heading: -77.5 },
        cameraPos: { x: -148.3582, y: -593.825, z: 211.9750, heading: 96 }
    },
    {
        playerPos: { x: -148.3194, y: -587.1647, z: 211.9750, heading: -140.0935 },
        cameraPos: { x: -146.1594, y: -590.0247, z: 211.9750, heading: 36.5 }
    },
    {
        playerPos: { x: -137.6439, y: -592.4662, z: 211.9750, heading: 99.7122 },
        cameraPos: { x: -140.991, y: -592.8826, z: 211.9750, heading: -83.2733 }
    },
];

const destroyCamera = (camera) => {
    if (camera && mp.cameras.exists(camera)) {
        try {
            camera.destroy();
        }
        catch (e) {
            mp.console.logInfo(`Ошибка при уничтожении камеры: ${e}`);
        }
    }
};
const createCamera = (position, rotation, fov) => {
    try {
        return mp.cameras.new('default', position, rotation, fov);
    }
    catch (e) {
        mp.console.logInfo(`Ошибка при создании камеры: ${e}`);
        return null;
    }
};

const playAnim = (animDict, animName, flag, duration) => {
    mp.game.streaming.requestAnimDict(animDict);
    setTimeout(() => {
        mp.players.local.taskPlayAnim(animDict, animName, 8.0, 1.0, duration, flag, 1.0, false, false, false);
    }, 350);
};
rce.registerAll('playAnim', (animDict, animName, flag, duration) => {
    playAnim(animDict, animName, flag, duration);
});

const CameraRotator = () => {
    let camera = null;
    let basePosition = null;
    let offsetVector = null;
    let heading = 0;
    let baseHeading = 0;
    let currentPoint = { x: 0, y: 0 };
    let isPause = false;
    let zUp = 0;
    let zUpMultipler = 1;
    let xBound = [0, 360];
    let zBound = [-0.08, 1];
    let offsetMultipler = 0;
    let offsetBound = [3, 4];
    let isActive = false;
    let mouseSensitivity = 1.5;
    const normilizeHeading = (heading) => {
        if (heading > 360) {
            heading = heading - 360;
        }
        else if (heading < 0) {
            heading = 360 + heading;
        }
        return heading;
    };
    const changePosition = () => {
        const position = mp.game.object.getObjectOffsetFromCoords(basePosition.x, basePosition.y, basePosition.z + zUp, heading, offsetVector.x, offsetVector.y, offsetVector.z);
        camera.setCoord(position.x, position.y, position.z);
    };
    const start = (cam, bPosition, lAtPosition, oVector, h, fov = undefined) => {
        camera = cam;
        basePosition = bPosition;
        offsetVector = oVector;
        heading = h;
        baseHeading = h;
        offsetMultipler = oVector.y;
        changePosition();
        camera.pointAtCoord(lAtPosition.x, lAtPosition.y, lAtPosition.z);
        if (fov) {
            camera.setFov(fov);
        }
        activate(true);
    };
    const pause = (state) => {
        isPause = state;
    };
    const stop = () => {
        activate(false);
    };
    const reset = () => {
        heading = baseHeading;
        zUp = 0;
        changePosition();
    };
    const setXBound = (min, max) => {
        xBound = [min, max];
    };
    const setOffsetBound = (min, max) => {
        offsetBound = [min, max];
    };
    const setZBound = (min, max) => {
        zBound = [min, max];
    };
    const setZUpMultipler = (value) => {
        zUpMultipler = value;
    };
    const getRelativeHeading = () => {
        return normilizeHeading(baseHeading - heading);
    };
    const activate = (state) => {
        isActive = state;
    };
    const onMouseScroll = (scrollDelta) => {
        // scrollDelta: 1 = скролл вверх (отдаление), -1 = скролл вниз (приближение)
        const sensitivity = 0.1;
        offsetMultipler -= scrollDelta * sensitivity;
        // Ограничения
        offsetMultipler = Math.max(offsetBound[0], Math.min(offsetBound[1], offsetMultipler));
        // Меняем ТОЛЬКО расстояние (Y компонент), не трогаем X и Z!
        offsetVector = new mp.Vector3(offsetVector.x, // Боковое смещение (не меняем)
        offsetMultipler, // Расстояние (меняем)
        offsetVector.z // Высота (не меняем)
        );
        changePosition();
    };
    const onMouseMove = (dX, dY) => {
        heading = normilizeHeading(heading + dX * 100 * mouseSensitivity);
        let relativeHeading = getRelativeHeading();
        if (xBound[0] !== -360 && xBound[1] !== 360) {
            if (relativeHeading > xBound[0] && relativeHeading < xBound[1]) {
                relativeHeading =
                    Math.abs(xBound[0] - relativeHeading) >
                        Math.abs(xBound[1] - relativeHeading)
                        ? xBound[1]
                        : xBound[0];
            }
        }
        heading = normilizeHeading(-relativeHeading + baseHeading);
        zUp += dY * zUpMultipler * -1 * mouseSensitivity;
        if (zUp > zBound[1]) {
            zUp = zBound[1];
        }
        else if (zUp < zBound[0]) {
            zUp = zBound[0];
        }
        changePosition();
    };
    const setMouseSensitivity = (value) => {
        mouseSensitivity = value;
    };
    const isPointEmpty = () => {
        return currentPoint.x === 0 && currentPoint.y === 0;
    };
    const setPoint = (x, y) => {
        currentPoint = { x, y };
    };
    const getPoint = () => {
        return currentPoint;
    };
    const createCam = (a, b, c) => {
        const entityPos = b;
        start(a, entityPos, entityPos, new mp.Vector3(-2.7, 3.0, 1), c);
        setZBound(-0.8, 1.8);
        setZUpMultipler(5);
        pause(true);
    };
    return {
        start,
        pause,
        stop,
        reset,
        setXBound,
        setOffsetBound,
        setZBound,
        setZUpMultipler,
        onMouseScroll,
        onMouseMove,
        isPointEmpty,
        setPoint,
        getPoint,
        setMouseSensitivity,
        createCam,
        get isActive() { return isActive; },
        get isPause() { return isPause; }
    };
};
const cameraRotator = CameraRotator();
mp.events.add("render", () => {
    if (!mp.gui.cursor.visible || !cameraRotator.isActive) {
        return;
    }
    const x = mp.game.controls.getDisabledControlNormal(2, 239);
    const y = mp.game.controls.getDisabledControlNormal(2, 240);
    if (cameraRotator.isPointEmpty()) {
        cameraRotator.setPoint(x, y);
    }
    const currentPoint = cameraRotator.getPoint();
    const dX = currentPoint.x - x;
    const dY = currentPoint.y - y;
    cameraRotator.setPoint(x, y);
    if (!cameraRotator.isPause) {
        if (mp.game.controls.isDisabledControlPressed(2, 237)) {
            cameraRotator.onMouseMove(dX, dY);
        }
        // ПРАВИЛЬНАЯ обработка скролла
        if (mp.game.controls.isDisabledControlJustPressed(2, 14)) { // Скролл вверх
            cameraRotator.onMouseScroll(-1); // Было 1, стало -1
        }
        else if (mp.game.controls.isDisabledControlJustPressed(2, 15)) { // Скролл вниз
            cameraRotator.onMouseScroll(1); // Было -1, стало 1
        }
    }
});
rce.registerAll('pauseCameraRotator', (toggle) => {
    cameraRotator.pause(toggle);
});

let currentCamera$1 = null;
let targetCamera$1 = null;
let localPlayer = mp.players.local;
let characterData = {
    firstName: '',
    lastName: '',
    age: '',
    gender: 'male',
    father: 0,
    mother: 21,
    shapeMix: 0.5,
    skinMix: 0.5,
    eyeColor: 0,
    eyebrow: 1,
    eyebrowColor: 62,
    hair: 0,
    hairColor: 0,
    beard: 0,
    beardColor: 62,
    faceFeatures: [
        0, 0, 0, 0, 0, 0,
        0, 0,
        0, 0,
        0, 0, 0,
        0, 0,
        0, 0, 0, 0,
        0
    ],
    clothes: {
        tops: 14,
        legs: 1,
        shoes: 1
    }
};
rce.registerAll('pauseCameraRotator', (pause) => {
    if (cameraRotator) {
        cameraRotator.pause(pause);
    }
});
rce.registerAll('cef:createChar:handleChange', (fieldName, value) => {
    // Для faceFeatures мы используем отдельную логику через updateFaceFeature
    if (fieldName === 'faceFeatures') {
        mp.console.logInfo(`[CHAR] Received faceFeatures array update, but using updateFaceFeature instead`);
        return;
    }
    // ЗАЩИТА: Не позволяем clothes стать числом
    if (fieldName === 'clothes') {
        mp.console.logWarning(`[CHAR] Attempt to set clothes as non-object value: ${typeof value}, value: ${value}`);
        return; // Игнорируем прямую установку clothes
    }
    characterData[fieldName] = value;
    handleCharacterChange(fieldName, value);
});
rce.registerAll('cef:createChar:updateFaceFeature', (index, value) => {
    try {
        const featureIndex = parseInt(index);
        const featureValue = parseFloat(value);
        if (isNaN(featureIndex) || featureIndex < 0 || featureIndex > 19) {
            mp.console.logError(`[CHAR] Invalid face feature index: ${index}`);
            return;
        }
        if (isNaN(featureValue) || featureValue < -1 || featureValue > 1) {
            mp.console.logError(`[CHAR] Invalid face feature value: ${value}`);
            return;
        }
        if (!Array.isArray(characterData.faceFeatures)) {
            mp.console.logError(`[CHAR] faceFeatures is not an array, resetting. Current type: ${typeof characterData.faceFeatures}, value: ${characterData.faceFeatures}`);
            characterData.faceFeatures = [
                0, 0, 0, 0, 0, 0,
                0, 0,
                0, 0,
                0, 0, 0,
                0, 0,
                0, 0, 0, 0,
                0
            ];
        }
        // Обновляем данные
        characterData.faceFeatures[featureIndex] = featureValue;
        // Применяем изменения к персонажу
        mp.players.local.setFaceFeature(featureIndex, featureValue);
    }
    catch (error) {
        mp.console.logError(`[CHAR] Error in updateFaceFeature: ${error}`);
    }
});
function handleCharacterChange(fieldName, value) {
    switch (fieldName) {
        case 'father':
        case 'mother':
        case 'shapeMix':
        case 'skinMix':
            mp.players.local.setHeadBlendData(characterData.mother, characterData.father, 0, characterData.mother, characterData.father, 0, characterData.shapeMix, characterData.skinMix, 0, false);
            break;
        case 'eyeColor':
            mp.players.local.setEyeColor(parseInt(value));
            break;
        case 'hair':
            mp.players.local.setComponentVariation(2, parseInt(value), 0, 0);
            break;
        case 'hairColor':
            mp.players.local.setHairColor(parseInt(value), 0);
            break;
        case 'eyebrow':
            mp.players.local.setHeadOverlay(2, parseInt(value) - 1, 1, characterData.eyebrowColor, 0);
            break;
        case 'eyebrowColor':
            mp.players.local.setHeadOverlay(2, characterData.eyebrow - 1, 1, parseInt(value), 0);
            break;
        case 'beard':
            mp.players.local.setHeadOverlay(1, parseInt(value) - 1, 1, characterData.beardColor, 0);
            break;
        case 'beardColor':
            if (characterData.gender === 'male') {
                mp.players.local.setHeadOverlay(1, characterData.beard - 1, 1, parseInt(value), 0);
            }
            break;
        case 'gender':
            if (value === 'male') {
                localPlayer.model = mp.game.joaat('mp_m_freemode_01');
                setTimeout(() => {
                    playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1);
                }, 500);
            }
            else {
                localPlayer.model = mp.game.joaat('mp_f_freemode_01');
                setTimeout(() => {
                    playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1);
                }, 500);
            }
            break;
    }
}
const createChar = (sid, numberSlot, uniqueScenario) => {
    rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604);
    rce.triggerServer('setNumberChar', numberSlot);
    currentCamera$1 = createCamera(new mp.Vector3(-112.6367, 355.0139, 113.0961), new mp.Vector3(-2, 0, -28.83), 30);
    if (currentCamera$1) {
        currentCamera$1.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }
    gui.execute('window.App.loadingReducer.showLoading(2500)');
    gui.execute(`window.App.createCharReducer.showCreateChar(${sid}, ${numberSlot})`);
    rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604);
    mp.console.logInfo(`Pos pl: ${mp.players.local.position}`);
    setTimeout(() => {
        mp.gui.cursor.visible = true;
        cameraRotator.start(currentCamera$1, mp.players.local.position, new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.4), new mp.Vector3(0, 2.5, 0.8), 155, 30);
        cameraRotator.pause(false);
        cameraRotator.setZBound(-1, 2);
        cameraRotator.setOffsetBound(2, 6);
        setTimeout(() => {
            playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1);
        }, 500);
    }, 500);
    mp.players.local.freezePosition(true);
};
rce.registerServer('closeCreateChar', () => {
    cameraRotator.stop();
    gui.execute('window.App.loadingReducer.showLoading(2500)');
    if (mp.cameras.exists(currentCamera$1))
        currentCamera$1.destroy();
    if (mp.cameras.exists(targetCamera$1))
        targetCamera$1.destroy();
    currentCamera$1 = null;
    targetCamera$1 = null;
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.gui.cursor.visible = false;
    setTimeout(() => {
        gui.execute('window.App.chatReducer.showChat()');
        showHud();
        mp.players.local.freezePosition(false);
        mp.game.ui.displayRadar(true);
    }, 2500);
});

const scenarios = [
    "WORLD_HUMAN_AA_COFFEE",
    "WORLD_HUMAN_CAR_PARK_ATTENDANT",
    "WORLD_HUMAN_CLIPBOARD_FACILITY",
    "WORLD_HUMAN_COP_IDLES",
    "WORLD_HUMAN_DRINKING_FACILITY",
    "WORLD_HUMAN_GUARD_STAND",
    "WORLD_HUMAN_STAND_MOBILE",
    "EAR_TO_TEXT_FAT",
    "WORLD_HUMAN_AA_SMOKE",
];
let currentCamera = null;
let targetCamera = null;
rce.registerServer('server:showSelectChar', async () => {
    await rce.callServer('selectChar:getDataAllChars');
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    mp.players.local.dimension;
    mp.game.ui.setPauseMenuActive(false);
    // setTimeout(() => {
    //   dataChars.forEach((char: any) => {
    //     const plPos = listCameras[char.numberslot - 1].playerPos
    //
    //     mp.labels.new(
    //         `${char.nickname} [0 LVL]`,
    //         new mp.Vector3(plPos.x, plPos.y, plPos.z + 0.965),
    //         { los: false, font: 4, drawDistance: 7.5, color: [255, 255, 255, 255], dimension: plDimension }
    //     )
    //
    //     mp.labels.new(
    //         `Наличные: $${char.cash} • На карте: $${char.bankmoney}`,
    //         new mp.Vector3(plPos.x, plPos.y, plPos.z + 0.9),
    //         { los: false, font: 4, drawDistance: 7.5, color: [255, 255, 255, 180], dimension: plDimension }
    //     )
    //   })
    // }, 4000)
    destroyCamera(currentCamera);
    destroyCamera(targetCamera);
    currentCamera = createCamera(new mp.Vector3(-143.5, -596.5199, 211.9750), new mp.Vector3(-2, 0, 204), 45);
    if (currentCamera) {
        currentCamera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }
    const timeoutLoading = setTimeout(() => {
        mp.gui.cursor.show(true, true);
        rce.triggerServer('client:playerSpawnedBeforeAuth');
        mp.players.local.taskStartScenarioInPlace(scenario, 0, true);
        clearInterval(timeoutLoading);
    }, 1500);
});
rce.registerAll('cef:selectSlotChar', async (slot, status) => {
    mp.console.logInfo('Oppps. Сработка!');
    mp.players.local;
    const plPos = listCameras[slot - 1].playerPos;
    const camPos = listCameras[slot - 1].cameraPos;
    mp.players.local.dimension;
    mp.console.logInfo(`Позиция камеры: ${JSON.stringify(listCameras[slot - 1].cameraPos)}`);
    if (currentCamera) {
        mp.console.logInfo(`Позиция камеры 2: ${JSON.stringify(currentCamera.getCoord())}`);
    }
    //destroyCamera(targetCamera)
    targetCamera = createCamera(new mp.Vector3(camPos.x, camPos.y, camPos.z), new mp.Vector3(-2, 0, camPos.heading), 45);
    mp.console.logInfo(`Позиция камеры 3: ${JSON.stringify(targetCamera.getCoord())}`);
    //const targetPos = targetCamera.getCoord();
    //if (targetPos.x === 0 && targetPos.y === 0 && targetPos.z === 0) {
    //  mp.console.logInfo('Камера создана с нулевыми координатами, исправляем...');
    //  // Принудительно устанавливаем координаты
    //  targetCamera.setCoord(camPos.x, camPos.y, camPos.z);
    //  targetCamera.setRot(-2, 0, camPos.heading, 2);
    //  mp.console.logInfo(`Исправленные координаты: ${JSON.stringify(targetCamera.getCoord())}`);
    //}
    // Устанавливаем камеру активной
    if (currentCamera) {
        try {
            targetCamera.setActiveWithInterp(currentCamera.handle, 500, 150, 150);
            mp.game.cam.renderScriptCams(true, true, 1000, true, false);
            mp.game.audio.playSoundFrontend(-1, "Click", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);
            setTimeout(() => {
                rce.triggerServer('client:setSelectedChar', slot, status, plPos);
                //rce.triggerServer('setPosChar', plPos.x, plPos.y, plPos.z, plPos.heading)
                setTimeout(() => {
                    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                    mp.players.local.taskStartScenarioInPlace(scenario, 0, false);
                }, 400);
            }, 200);
        }
        catch (e) {
            mp.console.logInfo(`Ошибка при установке плавного перехода: ${e}`);
            targetCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false);
        }
    }
    else {
        targetCamera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }
    setTimeout(() => {
        destroyCamera(currentCamera);
        currentCamera = targetCamera;
    }, 500);
    mp.console.logInfo(`${JSON.stringify(listCameras[slot - 1].cameraPos)}`);
});
rce.registerServer('closedSelectCreateChar', (sid, numberSlot, uniqueScenario) => {
    if (mp.cameras.exists(currentCamera))
        currentCamera.destroy();
    if (mp.cameras.exists(targetCamera))
        targetCamera.destroy();
    currentCamera = null;
    targetCamera = null;
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.gui.cursor.show(false, false);
    createChar(sid, numberSlot);
    //mp.players.local.freezePosition(false)
    //mp.players.local.clearTasks()
    //gui.execute(`window.App.chatReducer.showChat()`)
    gui.execute(`window.App.selectCharReducer.hideSelectChar()`);
});
rce.registerServer('closeSelectChar', () => {
    if (mp.cameras.exists(currentCamera))
        currentCamera.destroy();
    if (mp.cameras.exists(targetCamera))
        targetCamera.destroy();
    currentCamera = null;
    targetCamera = null;
    gui.execute('window.App.loadingReducer.showLoading(1000)');
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.gui.cursor.show(false, false);
    setTimeout(() => {
        gui.execute('window.App.chatReducer.showChat()');
        showHud();
        mp.players.local.freezePosition(false);
        mp.game.ui.displayRadar(true);
    }, 1000);
});

const Natives = {
    SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
    SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
    IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
};
rce.registerAll('moveSkyCamera', (moveTo, switchType) => {
    const localplayer = mp.players.local;
    if (!localplayer || !localplayer.handle)
        return;
    let safeType = 1;
    if (switchType !== undefined || switchType !== null) {
        let parsed = parseInt(switchType, 10);
        if (!isNaN(parsed))
            safeType = parsed;
    }
    mp.console.logInfo(`Sky camera: ${localplayer.handle}, ${moveTo}, ${switchType}`);
    switch (moveTo) {
        case 'up':
            mp.console.logInfo('Up');
            mp.game.invoke(Natives.SWITCH_OUT_PLAYER, localplayer.handle, 0, safeType);
            break;
        case 'down':
            mp.console.logInfo('Down');
            if (gui.browser.active === false) {
                checkCamInAir();
            }
            mp.game.invoke(Natives.SWITCH_IN_PLAYER, localplayer.handle);
            break;
    }
});
const checkCamInAir = () => {
    if (mp.game.invoke(Natives.IS_PLAYER_SWITCH_IN_PROGRESS)) {
        setTimeout(checkCamInAir, 400);
    }
    else {
        mp.players.local.freezePosition(false);
    }
};

rce.registerAll('getGroundZ', () => {
    const pos = mp.players.local.position;
    return mp.game.gameplay.getGroundZFor3DCoord(pos.x, pos.y, pos.z, false, false);
});

const applyUpperBody = (player) => {
    if (!mp.players.exists(player) || !player.handle) {
        return;
    }
    player.model === mp.game.joaat('mp_m_freemode_01') ? 'male' : 'female';
    const jacket = player.getVariable('jacket');
    const shirt = player.getVariable('shirt');
    let topDrawable = 15;
    let topTexture = 0;
    if (jacket && typeof jacket.drawable === 'number' && jacket.drawable > 0 && jacket.drawable !== 15) {
        topDrawable = jacket.drawable;
        topTexture = jacket.texture ?? 0;
    }
    else if (shirt && typeof shirt.drawable === 'number' && shirt.drawable > 0 && shirt.drawable !== 15) {
        topDrawable = shirt.drawable;
        topTexture = shirt.texture ?? 0;
    }
    player.setComponentVariation(11, topDrawable, topTexture, 2);
    let undershirtDrawable = 15;
    let undershirtTexture = 0;
    if (shirt && shirt.drawable > 0) {
        undershirtDrawable = 0;
        undershirtTexture = shirt.texture ?? 0;
    }
    player.setComponentVariation(8, undershirtDrawable, undershirtTexture, 2);
    let torsoDrawable = 15;
    if (topDrawable !== 15) {
        torsoDrawable = 15;
    }
    player.setComponentVariation(3, torsoDrawable, 0, 2);
    console.log(`[CLOTHES SYNC] Applied for player ${player.remoteId}: ` +
        `top=${topDrawable}/${topTexture}, undershirt=${undershirtDrawable}/${undershirtTexture}, torso=${torsoDrawable}`);
};
mp.events.add('entityStreamIn', (entity) => {
    if (entity.type !== 'player') {
        return;
    }
    const player = entity;
    applyUpperBody(player);
});
mp.events.addDataHandler('jacket', (entity, value) => {
    if (entity.type === 'player') {
        applyUpperBody(entity);
    }
});
mp.events.addDataHandler('shirt', (entity, value) => {
    if (entity.type === 'player') {
        applyUpperBody(entity);
    }
});
mp.events.add('playerReady', () => {
    applyUpperBody(mp.players.local);
});

const getDistanceFactor = (distance, maxDistance = 400, baseScale = 0.25) => {
    const clampedDist = Math.max(0.1, Math.min(distance, maxDistance));
    const factor = clampedDist / maxDistance;
    const minRelative = 0.6;
    const relativeScale = 1 - factor * 0.65;
    const finalRelative = Math.max(minRelative, relativeScale);
    const alpha = Math.round(255 * (1 - factor * 0.4));
    const maxLift = 0.045;
    const yOffset = maxLift * factor;
    return {
        scale: [finalRelative * baseScale, finalRelative * baseScale],
        alpha,
        yOffset,
        relativeFactor: finalRelative
    };
};

let lastHit = {
    type: 'none',
    remoteId: null,
    distToHit: 0
};
const checkCenterScreenHit = (rayLength, hitMaxDist, flags) => {
    const camera = mp.cameras.new("gameplay");
    const start = camera.getCoord();
    const dir = camera.getDirection();
    const end = new mp.Vector3(start.x + dir.x * rayLength, start.y + dir.y * rayLength, start.z + dir.z * rayLength);
    const ignore = mp.players.local.handle;
    const result = mp.raycasting.testPointToPoint(start, end, ignore, flags);
    const currentHit = {
        type: 'none',
        remoteId: null,
        handle: null,
        position: null,
        entity: null,
        distToHit: 0,
    };
    if (!result || !result.entity) {
        return currentHit;
    }
    const entity = result.entity;
    const hitPos = result.position;
    const playerPos = mp.players.local.position;
    const distToHit = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, hitPos.x, hitPos.y, hitPos.z);
    if (distToHit > hitMaxDist) {
        return currentHit;
    }
    currentHit.position = hitPos;
    currentHit.distToHit = distToHit;
    currentHit.entity = entity;
    currentHit.handle = entity.handle;
    if (entity.type) {
        currentHit.type = entity.type;
        currentHit.remoteId = entity.remoteId ?? null;
    }
    return currentHit;
};
const updateLastHit = (newHit) => {
    lastHit = newHit;
};

const MAX_DIST_TEXT = 7;
const HIT_MAX_DIST$2 = 2;
const RAY_LENGTH$2 = 15;
const worldItems = new Map();
let lastObjectCheckTime = 0;
mp.events.add('render', () => {
    mp.objects.forEachInStreamRange((obj) => {
        const localplayer = mp.players.local;
        const posPl = localplayer.position;
        const posObj = obj.position;
        const distToObj = mp.game.system.vdist(posObj.x, posObj.y, posObj.z, posPl.x, posPl.y, posPl.z);
        const itemInfo = worldItems.get(obj.id);
        if (!itemInfo)
            return;
        // Отображаем текст предмета
        if (distToObj <= MAX_DIST_TEXT) {
            const p = getDistanceFactor(distToObj, MAX_DIST_TEXT, 0.37);
            const textQuantity = itemInfo.value > 1 ? `[x ${itemInfo.value}]` : '';
            mp.game.graphics.drawText(`${itemInfo.item.name} ${textQuantity}`, [posObj.x, posObj.y - p.yOffset - 0.01, posObj.z], {
                font: 4,
                color: [255, 255, 255, p.alpha - 30],
                scale: p.scale,
                outline: true
            });
        }
        // Управление коллизией
        if (localplayer.vehicle) {
            obj.setCollision(false, false);
        }
        else {
            obj.setCollision(true, false);
        }
    });
    // Проверяем луч только для объектов (флаг 16)
    const hit = checkCenterScreenHit(RAY_LENGTH$2, HIT_MAX_DIST$2, 16);
    const currentTime = Date.now();
    const changed = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId;
    // Проверяем хит для объектов только если прошло достаточно времени
    if (changed && currentTime - lastObjectCheckTime > 50) {
        lastObjectCheckTime = currentTime;
        // Сбрасываем наведение только если у нас было наведение на объект
        if (lastHit.type === 'object') {
            gui.execute(`window.App.hoverInteractionReducer.removeHover()`);
        }
        updateLastHit(hit);
        // Устанавливаем наведение только если луч попал в объект на допустимой дистанции
        if (hit.type === 'object' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST$2) {
            gui.execute(`window.App.hoverInteractionReducer.setHover()`);
        }
    }
});
rce.registerServer('droppedItemOnGround', (item, objId, objPos, value) => {
    worldItems.set(objId, { item, position: objPos, value });
});
mp.keys.bind(Keys.VK_E, false, async () => {
    if (lastHit.type !== 'object' || lastHit.remoteId === null)
        return;
    const itemData = worldItems.get(lastHit.remoteId);
    if (!itemData)
        return;
    const { item, value } = itemData;
    const pickUp = await rce.callServer('pickUpItem', lastHit.remoteId, item, value);
    if (pickUp.status === 'destroyItem') {
        worldItems.delete(lastHit.remoteId);
        return;
    }
    if (pickUp.status === 'denied') {
        if (pickUp.text) {
            gui.execute(`window.App.sendNotifyReducer.sendNotify('err', '${pickUp.text}', 3000, 'bottom')`);
        }
        return;
    }
    if (pickUp.status === 'approved') {
        worldItems.delete(lastHit.remoteId);
        gui.execute(`window.App.waitingLoaderReducer.showWaitingLoader(2000, 'Поднятие предмета')`);
    }
});

const updateDiscord = () => {
    const player = mp.players.local;
    let subtitle;
    if (player.getVariable('player_spawned') === undefined) {
        subtitle = 'Входит в аккаунт';
    }
    else if (player.isInAnyVehicle(false)) {
        if (player.getSeatIsTryingToEnter() !== -3) {
            subtitle = 'Сидит в транспорте';
        }
        else {
            subtitle = 'Управляет транспортом';
        }
    }
    else if (player.getVariable('player_knockout')) {
        subtitle = 'Без сознания...';
    }
    else if (player.isInWater()) {
        subtitle = 'Плавает';
    }
    else {
        subtitle = 'Странствует по штату';
    }
    mp.discord.update(subtitle, 'REAL RP');
};
setInterval(updateDiscord, 10000);

rce.registerAll('handleActionInteraction', (typeEntity, action, targetId) => {
    const target = typeEntity === 'player' ? mp.players.at(targetId) : mp.vehicles.at(targetId);
    if (target === undefined)
        return;
    const lcplayer = mp.players.local;
    const distToEntity = mp.game.system.vdist(lcplayer.position.x, lcplayer.position.y, lcplayer.position.z, target.position.x, target.position.y, target.position.z);
    if (distToEntity <= 7) {
        switch (typeEntity) {
            case 'player':
                rce.triggerServer('handleInteractionPlayer', action, targetId);
                break;
            case 'vehicle':
                rce.triggerServer('handleInteractionVehicle', action, targetId);
                break;
        }
    }
    else {
        gui.execute(`window.App.sendNotifyReducer.sendNotify('err', 'Игрок далеко от вас!', 3000, 'bottom')`);
    }
});

let ev = null;
rce.registerServer('showOffer', (senderId, title, description, duration) => {
    const playerSender = mp.players.at(senderId);
    if (!playerSender)
        return;
    const lcplayer = mp.players.local;
    const distToSender = mp.game.system.vdist(lcplayer.position.x, lcplayer.position.y, lcplayer.position.z, playerSender.position.x, playerSender.position.y, playerSender.position.z);
    gui.execute(`window.App.offerReducer.showOffer('${title}', '${description}', ${duration})`);
    return new Promise((resolve) => {
        let resolved = false;
        const timeoutId = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve('timeout');
                cleanup();
            }
        }, duration);
        const keyHandler = () => {
            if (resolved) {
                cleanup();
                return;
            }
            if (mp.keys.isDown(Keys.VK_Y)) {
                if (distToSender > 8) {
                    gui.execute(`window.App.sendNotifyReducer.sendNotify('err', 'Игрок не рядом с вами!', 3500, 'bottom')`);
                    cleanup();
                    return;
                }
                clearTimeout(timeoutId);
                resolve(true);
                cleanup();
            }
            if (mp.keys.isDown(Keys.VK_N)) {
                clearTimeout(timeoutId);
                resolve(false);
                cleanup();
            }
        };
        if (ev) {
            resolved = true;
            ev.destroy();
        }
        ev = new mp.Event("render", keyHandler);
        const cleanup = () => {
            if (ev) {
                gui.execute(`window.App.offerReducer.hideOffer()`);
                ev.destroy();
                ev = null;
            }
        };
    });
});

const HIT_MAX_DIST$1 = 2.5;
const RAY_LENGTH$1 = 15;
let openedInteraction$1 = false;
mp.events.add('render', () => {
    const hit = checkCenterScreenHit(RAY_LENGTH$1, HIT_MAX_DIST$1, 8);
    const changedHit = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId;
    if (openedInteraction$1 && (hit.type !== 'player' || hit.remoteId === null || hit.distToHit > HIT_MAX_DIST$1)) {
        openedInteraction$1 = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        mp.gui.cursor.visible = false;
    }
    if (hit.type === 'player' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST$1 && !mp.players.local.vehicle) {
        const target = mp.players.atRemoteId(hit.remoteId);
        if (target && !mp.players.local.vehicle) {
            const posTarget = target.position;
            const factor = getDistanceFactor(hit.distToHit, HIT_MAX_DIST$1, 0.48);
            mp.game.graphics.drawText('[E]', [posTarget.x, posTarget.y - factor.yOffset, posTarget.z], {
                font: 4,
                color: [44, 255, 132, factor.alpha],
                scale: factor.scale,
                outline: true
            });
        }
        if (changedHit) {
            if (lastHit.type !== 'none') {
                gui.execute(`window.App.hoverInteractionReducer.removeHover()`);
            }
            updateLastHit(hit);
            gui.execute(`window.App.hoverInteractionReducer.setHover()`);
        }
    }
    else {
        if (changedHit && lastHit.type === 'player') {
            gui.execute(`window.App.hoverInteractionReducer.removeHover()`);
        }
    }
});
mp.keys.bind(Keys.VK_E, false, async () => {
    if (lastHit.type === 'none')
        return;
    if (openedInteraction$1) {
        openedInteraction$1 = false;
        mp.gui.cursor.visible = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        return;
    }
    const openedMenus = await rce.callCef('getOpenMenus');
    const specialMenus = ['Welcome', 'Auth', 'SelectChar', 'Spawn', 'CreateChar', 'Loading', 'Rent'];
    const hasSpecialOpen = openedMenus.some(menu => specialMenus.includes(menu));
    if (lastHit.type === 'player' && lastHit.remoteId !== null && lastHit.distToHit <= HIT_MAX_DIST$1 && !hasSpecialOpen) {
        openedInteraction$1 = true;
        mp.console.logWarning(`Взаимодействуете с ID: ${lastHit.remoteId}`);
        gui.execute(`window.App.interactionReducer.showInteraction('player', ${lastHit.remoteId})`);
        mp.gui.cursor.visible = true;
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (openedInteraction$1) {
        openedInteraction$1 = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        mp.gui.cursor.visible = false;
    }
});

let fuelInterval = null;
let currentLocalFuel = 100;
let lastSentFuel = 100;
const startFuelSystem = (initialFuel = 100) => {
    if (fuelInterval)
        clearInterval(fuelInterval);
    currentLocalFuel = Math.max(0, Math.min(initialFuel, 100));
    lastSentFuel = currentLocalFuel;
    fuelInterval = setInterval(() => {
        const player = mp.players.local;
        const vehicle = player.vehicle;
        if (!vehicle)
            return;
        const isEngineOn = vehicle.getVariable('VEH_ENGINE');
        if (!isEngineOn)
            return;
        const speedVeh = vehicle.getSpeed() * 3.6;
        if (speedVeh < 2)
            return;
        let consumption = speedVeh > 5 ? speedVeh * 0.009 : 0.035;
        if (currentLocalFuel <= consumption) {
            currentLocalFuel = 0;
            gui.execute(`window.App.fuelVehReducer.setFuel(0)`);
            rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'fuel', 0);
            rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'engine', false);
            rce.trigger('sendNotify', 'err', 'Топливо закончилось! Двигатель заглох', 4000, 'bottom');
            return;
        }
        currentLocalFuel = Math.max(0, currentLocalFuel - consumption);
        currentLocalFuel = Number(currentLocalFuel.toFixed(2));
        const fuelSpentSinceLastSend = lastSentFuel - currentLocalFuel;
        if (fuelSpentSinceLastSend >= 1) {
            rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'fuel', currentLocalFuel);
            lastSentFuel = currentLocalFuel;
        }
        gui.execute(`window.App.fuelVehReducer.setFuel(${currentLocalFuel})`);
    }, 900);
};
const stopFuelSystem = () => {
    if (fuelInterval) {
        clearInterval(fuelInterval);
        fuelInterval = null;
    }
};

const HIT_MAX_DIST = 2.5;
const RAY_LENGTH = 15;
let openedInteraction = false;
const lcplayer$1 = mp.players.local;
mp.events.add('render', () => {
    const hit = checkCenterScreenHit(RAY_LENGTH, HIT_MAX_DIST, 2);
    const changedHit = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId;
    if (openedInteraction && (hit.type !== 'vehicle' || hit.remoteId === null || hit.distToHit > HIT_MAX_DIST)) {
        openedInteraction = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        mp.gui.cursor.visible = false;
    }
    if (hit.type === 'vehicle' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST && !mp.players.local.vehicle) {
        const veh = mp.vehicles.atRemoteId(hit.remoteId);
        if (veh && !mp.players.local.vehicle) {
            const posVeh = veh.position;
            const factor = getDistanceFactor(hit.distToHit, HIT_MAX_DIST, 0.48);
            mp.game.graphics.drawText('[E]', [posVeh.x, posVeh.y - factor.yOffset, posVeh.z], {
                font: 4,
                color: [255, 255, 255, factor.alpha - 30],
                scale: factor.scale,
                outline: true
            });
        }
        if (changedHit) {
            if (lastHit.type !== 'none') {
                gui.execute(`window.App.hoverInteractionReducer.removeHover()`);
            }
            updateLastHit(hit);
            gui.execute(`window.App.hoverInteractionReducer.setHover()`);
        }
    }
    else {
        if (changedHit && lastHit.type === 'vehicle') {
            gui.execute(`window.App.hoverInteractionReducer.removeHover()`);
        }
    }
});
mp.keys.bind(Keys.VK_E, false, async () => {
    if (lastHit.type === 'none')
        return;
    if (openedInteraction) {
        openedInteraction = false;
        mp.gui.cursor.visible = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        return;
    }
    const openedMenus = await rce.callCef('getOpenMenus');
    const specialMenus = ['Welcome', 'Auth', 'SelectChar', 'Spawn', 'CreateChar', 'Loading', 'Rent'];
    const hasSpecialOpen = openedMenus.some(menu => specialMenus.includes(menu));
    if (lastHit.type === 'vehicle' && lastHit.remoteId !== null && lastHit.distToHit <= HIT_MAX_DIST && !hasSpecialOpen) {
        openedInteraction = true;
        gui.execute(`window.App.interactionReducer.showInteraction('vehicle', ${lastHit.remoteId})`);
        mp.gui.cursor.visible = true;
    }
});
mp.keys.bind(Keys.VK_L, false, () => {
    if (!lcplayer$1.vehicle)
        return;
    rce.triggerServer('handleInteractionVehicle', 'toggleDoors', lcplayer$1.vehicle.remoteId);
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (openedInteraction) {
        openedInteraction = false;
        gui.execute(`window.App.interactionReducer.hideInteraction()`);
        mp.gui.cursor.visible = false;
    }
});
mp.events.add('playerEnterVehicle', (vehicle, seat) => {
    gui.execute(`window.App.hoverInteractionReducer.visibleHover(false)`);
});
mp.events.add('playerLeaveVehicle', (vehicle, seat) => {
    gui.execute(`window.App.hoverInteractionReducer.visibleHover(true)`);
});

let keyDownE = 'disabled';
let rentData = null;
let isWithdrawal = null;
let penaltyTimer = null;
let warningRentOver = null;
let syncInterval = null;
let rentFromPlayer = null;
const clearAllRentTimers = () => {
    if (isWithdrawal !== null) {
        try {
            clearTimeout(isWithdrawal);
        }
        catch (e) { }
        isWithdrawal = null;
    }
    if (warningRentOver !== null) {
        try {
            clearTimeout(warningRentOver);
        }
        catch (e) { }
        warningRentOver = null;
    }
    if (penaltyTimer !== null) {
        try {
            clearTimeout(penaltyTimer);
        }
        catch (e) { }
        penaltyTimer = null;
    }
    if (syncInterval !== null) {
        try {
            clearInterval(syncInterval);
        }
        catch (e) { }
        syncInterval = null;
    }
};
rce.registerServer('rentColshape', (status, data) => {
    if (status === 'enabled') {
        keyDownE = 'enabled';
        rentData = data;
    }
    else {
        handleHideRent();
        keyDownE = 'disabled';
        rentData = null;
    }
});
rce.registerServer('closeRent', () => {
    handleHideRent();
});
rce.registerServer('startRentTimer', (uid, vehId, time) => {
    clearAllRentTimers();
    rentFromPlayer = {
        uid: uid,
        vehId: vehId,
        rentEndTime: Date.now() + (time * 60 * 1000)
    };
    warningRentOver = setTimeout(() => {
        gui.execute(`window.App.sendNotifyReducer.sendNotify('warning', 'Внимание! Аренда транспорта завершится через ${time} минут', 4000, 'bottom')`);
    }, (time * 60 * 1000) * 0.25);
    isWithdrawal = setTimeout(() => {
        rentFromPlayer = { uid: null, vehId: null, rentEndTime: null };
        rce.triggerServer('rentOver');
        clearAllRentTimers();
        gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Аренда завершена. Транспорт был изъят', 4000, 'bottom')`);
    }, time * 60 * 1000);
    syncInterval = setInterval(() => {
        if (!rentFromPlayer?.rentEndTime)
            return;
        const remainingMs = rentFromPlayer.rentEndTime - Date.now();
        const remainingMins = Math.max(0, Math.ceil(remainingMs / 60000));
        rce.triggerServer('syncRentTime', remainingMins);
    }, 5 * 60 * 1000); // 5 минуток
});
rce.registerAll('cef:cancelRentCar', () => {
    rentFromPlayer = { uid: null, vehId: null, rentEndTime: null };
    rce.triggerServer('rentOver');
    clearAllRentTimers();
    if (rentData)
        rentData.isTakenRent = false;
    gui.execute(`window.App.rentReducer.setIsTakenRent(false)`);
    gui.execute(`window.App.sendNotifyReducer.sendNotify('success', 'Аренда была завершена!', 3200, 'bottom')`);
});
mp.events.add('playerQuit', () => {
    if (!rentFromPlayer || !rentFromPlayer.uid) {
        clearAllRentTimers();
        rentFromPlayer = { uid: null, vehId: null, rentEndTime: null };
        return;
    }
    let remainingMins = 0;
    if (rentFromPlayer.rentEndTime) {
        let remainingMs = rentFromPlayer.rentEndTime - Date.now();
        if (remainingMs < 0)
            remainingMs = 0;
        remainingMins = Math.ceil(remainingMs / 60000);
    }
    rce.triggerServer('rentPlayerQuit', rentFromPlayer.uid, remainingMins, !!mp.players.local.vehicle);
    clearAllRentTimers();
    rentFromPlayer = { uid: null, vehId: null, rentEndTime: null };
});
mp.events.add('playerLeaveVehicle', (vehicle, seat) => {
    if (!rentFromPlayer || !vehicle || vehicle.remoteId !== rentFromPlayer.vehId)
        return;
    gui.execute(`window.App.sendNotifyReducer.sendNotify('warning', 'Аренда завершится через 10 минут!', 3500, 'bottom')`);
    penaltyTimer = setTimeout(() => {
        rce.triggerServer('rentOver');
        clearAllRentTimers();
        rentFromPlayer = { uid: null, vehId: null, rentEndTime: null };
        gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Вы не вернулись в арендованное т/с. Транспорт был изъят', 4000, 'bottom')`);
    }, 600000);
});
mp.events.add('playerEnterVehicle', (vehicle, seat) => {
    if (!rentFromPlayer || !vehicle || vehicle.remoteId !== rentFromPlayer.vehId)
        return;
    const remainingMs = rentFromPlayer.rentEndTime - Date.now();
    const remainingMins = Math.max(0, Math.ceil(remainingMs / 60000));
    if (penaltyTimer !== null) {
        try {
            clearTimeout(penaltyTimer);
        }
        catch (e) { }
        penaltyTimer = null;
    }
    gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Аренда возобновлена. Осталось ${remainingMins} мин до окончания', 4000, 'bottom')`);
});
const handleShowRent = () => {
    mp.gui.cursor.show(true, true);
    gui.execute('window.App.hudReducer.hideHud()');
    gui.execute('window.App.chatReducer.hideChat()');
    gui.execute(`window.App.rentReducer.showRent(${JSON.stringify(rentData)})`);
};
const handleHideRent = () => {
    mp.game.ui.setPauseMenuActive(false);
    mp.gui.cursor.show(false, false);
    gui.execute(`window.App.rentReducer.hideRent()`);
    showHud();
    gui.execute('window.App.chatReducer.showChat()');
    setTimeout(() => {
        mp.game.ui.setPauseMenuActive(true);
    }, 300);
};
mp.keys.bind(Keys.VK_E, false, () => {
    if (keyDownE !== 'disabled') {
        handleShowRent();
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    handleHideRent();
});
rce.registerAll('closeRentMenu', () => {
    handleHideRent();
});

let localplayer = mp.players.local;
let currentVehicle$1 = null;
mp.events.add('playerEnterVehicle', (vehicle, seat) => {
    if (vehicle && seat === -1) {
        currentVehicle$1 = vehicle;
        gui.execute(`window.App.hudReducer.showHud(true)`);
        gui.execute(`window.App.speedVehReducer.setEngine(${vehicle.getVariable('VEH_ENGINE') ?? true})`);
    }
});
mp.events.add('playerLeaveVehicle', (vehicle, seat) => {
    if (vehicle && seat === -1) {
        currentVehicle$1 = null;
        gui.execute(`window.App.hudReducer.showHud(false)`);
    }
});
mp.events.add('render', () => {
    if (localplayer.vehicle !== null) {
        let speed = localplayer.vehicle.getSpeed() * 3.6;
        gui.execute(`window.App.speedVehReducer.setSpeed(${Number(speed.toFixed(0))})`);
    }
    else {
        if (currentVehicle$1 !== null) {
            currentVehicle$1 = null;
            gui.execute(`window.App.hudReducer.showHud(false)`);
            gui.execute(`window.App.speedVehReducer.setSpeed(0)`);
        }
    }
});

const lcplayer = mp.players.local;
let isKeyPressed = false;
let keyPressedTimeout = null;
mp.keys.bind(Keys.VK_2, false, async () => {
    if (!lcplayer.vehicle)
        return;
    if (isKeyPressed)
        return;
    if (keyPressedTimeout)
        clearTimeout(keyPressedTimeout);
    isKeyPressed = true;
    keyPressedTimeout = setTimeout(() => {
        isKeyPressed = false;
        keyPressedTimeout = null;
        clearTimeout(keyPressedTimeout);
    }, 1500);
    const vehicle = lcplayer.vehicle;
    const currentEngineStatus = vehicle.getVariable('VEH_ENGINE') ?? true;
    const currentFuel = vehicle.getVariable('VEH_FUEL') ?? true;
    const hasKey = await rce.callServer('playerHasKeyForVehicle', vehicle.remoteId);
    if (!hasKey) {
        rce.trigger('sendNotify', 'err', 'У вас нет ключа от этого транспорта!', 3200, 'bottom');
        return;
    }
    if (currentEngineStatus === false) {
        const vehHealth = vehicle.getVariable('VEH_HEALTH');
        if (vehHealth <= 300) {
            rce.trigger('sendNotify', 'err', 'Транспорт сломан! Невозможно завести', 3200, 'bottom');
            return;
        }
    }
    const newEngineState = !currentEngineStatus;
    if (newEngineState === true) {
        if (currentFuel <= 0) {
            rce.trigger('sendNotify', 'err', 'В баке нет топлива! Невозможно завести двигатель!', 3200, 'bottom');
            return;
        }
        rce.trigger('sendNotify', 'success', 'Транспорт заведен', 2000, 'bottom');
        startFuelSystem(currentFuel);
        gui.execute(`window.App.fuelVehReducer.setFuel(${currentFuel})`);
        gui.execute(`window.App.speedVehReducer.setEngine(true)`);
    }
    else {
        rce.trigger('sendNotify', 'err', 'Транспорт заглушен', 2000, 'bottom');
        stopFuelSystem();
        gui.execute(`window.App.fuelVehReducer.setFuel(0)`);
        gui.execute(`window.App.speedVehReducer.setEngine(false)`);
    }
    rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'engine', newEngineState);
});

let lastBodyHealth = 1000;
let currentVehicle = null;
const player = mp.players.local;
rce.registerAll('getModelVeh', () => {
    if (player.vehicle) {
        let modelName = mp.game.vehicle.getDisplayNameFromVehicleModel(player.vehicle.model).toLowerCase();
        mp.console.logWarning(`model: ${modelName}`);
        return modelName;
    }
    else {
        return null;
    }
});
mp.events.add("playerReady", () => {
    mp.game.weapon.setEnableLocalOutgoingDamage(true);
    mp.game.vehicle.defaultEngineBehaviour = false;
});
mp.events.add("playerEnterVehicle", (vehicle, seat) => {
    if (seat === -1) {
        const savedFuel = vehicle.getVariable('VEH_FUEL');
        stopFuelSystem();
        startFuelSystem(savedFuel);
        vehicle.setInvincible(false);
        currentVehicle = vehicle;
        lastBodyHealth = Math.floor(vehicle.getBodyHealth());
        gui.execute(`window.App.fuelVehReducer.setFuel(0)`);
    }
});
mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
    if (seat === -1) {
        currentVehicle = null;
    }
});
setInterval(() => {
    if (!currentVehicle || !mp.vehicles.exists(currentVehicle))
        return;
    const currentBody = Math.floor(currentVehicle.getBodyHealth());
    if (currentBody < lastBodyHealth - 4) {
        rce.triggerServer('updateVehicleProp', currentVehicle.id, 'health', currentBody);
    }
    lastBodyHealth = currentBody;
}, 2000);
mp.events.add('outgoingDamage', (sourceEntity, targetEntity, sourcePlayer, weapon, boneIndex, damage) => {
    if (!targetEntity || targetEntity.type !== "vehicle")
        return;
    const vehicle = targetEntity;
    const localPlayer = mp.players.local;
    if (!localPlayer.vehicle || localPlayer.vehicle.handle !== vehicle.handle)
        return;
    if (vehicle.getPedInSeat(-1) !== localPlayer.handle)
        return;
    const currentBodyHealth = Math.floor(vehicle.getBodyHealth());
    rce.triggerServer('updateVehicleProp', vehicle.id, 'health', currentBodyHealth);
});

// mp.game.invoke("0x6E9EF3A33C8899F8", true)
// mp.game.invoke("0x4CC7F0FEA5283FE0", true)
// mp.game.invoke("0xAEEDAD1420C65CC0", true)
mp.events.add('render', () => {
    mp.game.ui.hideHudComponentThisFrame(3);
    mp.game.ui.hideHudComponentThisFrame(4);
    mp.game.ui.hideHudComponentThisFrame(6);
    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(9);
});
