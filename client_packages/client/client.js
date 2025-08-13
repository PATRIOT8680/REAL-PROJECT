import { Rpc } from '@entityseven/rage-fw-rpc';

const rpc = new Rpc({
    debugLogs: false,
});

const openInterfaces = new Set();
const handleInterfaceVisibility = (interfaceName, isVisible) => {
    mp.console.logInfo(`Interface: ${interfaceName}, Visible: ${isVisible}`);
    if (isVisible) {
        openInterfaces.add(interfaceName);
    }
    else {
        openInterfaces.delete(interfaceName);
    }
};
rpc.register('toggleInterface', (interfaceName, isVisible, duration) => {
    setTimeout(() => {
        mp.gui.cursor.show(true, true);
    }, 500);
    mp.gui.cursor.visible = true;
    rpc.callBrowser(`cef:${isVisible ? 'show' : 'hide'}${interfaceName}`, [duration]);
    handleInterfaceVisibility(interfaceName, isVisible);
});

const maxDistance = 25 * 25;
const width = 0.025;
const height = 0.004;
let visibleNametags = true;
let playerTarget = null;
let playerAimAt = null;
mp.nametags.enabled = false;
mp.keys.bind(global.Keys.VK_F9, false, () => {
    visibleNametags = !visibleNametags;
});
mp.events.add('render', (nametags) => {
    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution();
    playerAimAt = mp.game.player.getEntityIsFreeAimingAt();
    playerTarget = mp.players.local;
    if (visibleNametags) {
        nametags.forEach(nametag => {
            let [player, x, y, distance] = nametag;
            if (distance <= maxDistance) {
                let scale = (distance / maxDistance);
                if (scale < 0.4)
                    scale = 0.4;
                y -= scale * (0.005 * (screenRes.y / 1080));
                if (player.getVariable('player_knockout')) {
                    mp.console.logWarning('В нокауте');
                }
                drawNametags(player, x, y, `Гражданин [ID: ${player.remoteId}]`, [255, 255, 255, 255]);
            }
        });
    }
});
const drawNametags = (player, x, y, displayName, color) => {
    mp.game.graphics.drawText(displayName, [x, y], {
        font: 0,
        color: color,
        scale: [0.35, 0.35],
        outline: true
    });
    if (playerTarget && player.handle === playerTarget.handle && playerAimAt) {
        y += 0.05;
        let health = player.getHealth();
        let armour = player.getArmour() / 100;
        health = health <= 100 ? health / 100 : (health - 100) / 100;
        if (armour <= 0) {
            mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false);
            mp.game.graphics.drawRect(x - width / 2 * (1 - health), y, width * health, height, 0, 255, 128, 255, false);
        }
        else {
            mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false);
            mp.game.graphics.drawRect(x - width / 2 * (1 - health), y, width * health, height, 0, 200, 255, 255, false);
            y -= 0.007;
            mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false);
            mp.game.graphics.drawRect(x - width / 2 * (1 - armour), y, width * armour, height, 0, 132, 255, 255, false);
        }
    }
};

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

const showLoading = (duration) => {
    setTimeout(() => {
        mp.gui.cursor.show(false, false);
        mp.gui.cursor.visible = false;
    }, 500);
    rpc.call('execute', [`window.App.loadingReducer.showLoading(${duration})`]);
    mp.game.graphics.triggerScreenblurFadeIn(1000);
    mp.game.graphics.isScreenblurFadeRunning();
    mp.game.audio.playSoundFrontend(0, 'slow', 'SHORT_PLAYER_SWITCH_SOUND_SET', true);
    setTimeout(() => {
        mp.game.graphics.triggerScreenblurFadeOut(1000);
        mp.game.audio.stopSound(0);
    }, duration);
};
rpc.register('client:showLoading', showLoading);
mp.console.logError('');

let activeCamera = null;
let currentPath = null;
let startTime = 0;
const lerp = (a, b, t) => {
    return a + (b - a) * t;
};
const createCamera = (pos, target) => {
    activeCamera = mp.cameras.new('default', new mp.Vector3(pos.x, pos.y, pos.z), new mp.Vector3(0, 0, pos.rot), 40);
    // Камера сразу смотрит на целевую точку (to)
    activeCamera.pointAtCoord(target.x, target.y, target.z);
    activeCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
};
let ev = null;
const startCamMoving = (path) => {
    rpc.callServer('client:startNewCamera', [path.persCoord]);
    currentPath = path;
    startTime = Date.now();
    if (ev) {
        ev.destroy();
    }
    createCamera(path.from, path.to);
    ev = new mp.Event("render", (player, reason, killer) => {
        if (!activeCamera || !currentPath)
            return;
        const now = Date.now();
        const progress = Math.min((now - startTime) / currentPath.duration, 1);
        const x = lerp(currentPath.from.x, currentPath.to.x, progress);
        const y = lerp(currentPath.from.y, currentPath.to.y, progress);
        const z = lerp(currentPath.from.z, currentPath.to.z, progress);
        activeCamera.setCoord(x, y, z);
        activeCamera.pointAtCoord(currentPath.to.x, currentPath.to.y, currentPath.to.z);
        if (progress >= 1) {
            stopCamMoving();
        }
    });
};
const stopCamMoving = () => {
    if (ev) {
        ev.destroy();
        ev = null;
    }
    destroyCamera();
};
const destroyCamera = () => {
    if (activeCamera) {
        activeCamera.destroy();
        activeCamera = null;
    }
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
};

const coordsCamera = [
    {
        from: { x: 1731.75830078125, y: 1721.3143310546875, z: 106.5699462890625, rot: -8.50393727140813 },
        to: { x: 1876.4439697265625, y: 2397.283447265625, z: 65.153076171875, rot: -31.181104466861342 },
        persCoord: { x: 1752.09228515625, y: 1914.2769775390625, z: 73.0556640625, rot: -11.338582743952959 },
        duration: 30000
    },
    {
        from: { x: 2529.032958984375, y: 563.6967163085938, z: 115.4498291015625, rot: 175.74803466570498 },
        to: { x: 2517.006591796875, y: 181.59561157226562, z: 107.867431640625, rot: 170.07874542816262 },
        persCoord: { x: 2532.03955078125, y: 476.29449462890625, z: 113.748046875, rot: -175.74803466570498 },
        duration: 30000
    },
    {
        from: { x: 227.5252685546875, y: 2956.02197265625, z: 47.24169921875, rot: 5.669291371976479 },
        to: { "x": 221.7098846435547, "y": 3261.57373046875, "z": 47.056396484375, "rot": -14.173229070271432 },
        persCoord: { x: 226.21978759765625, y: 3029.472412109375, z: 42.3385009765625, rot: 0 },
        duration: 30000
    },
    {
        from: { x: 159.1648406982422, y: 3707.98681640625, z: 41.2938232421875, rot: 22.677165487905917 },
        to: { x: 34.78681564331055, y: 4056.2900390625, z: 50.15673828125, rot: 19.84252086913473 },
        persCoord: { x: 117.32307434082031, y: 3786.883544921875, z: 31.942138671875, rot: 22.677165487905917 },
        duration: 30000
    },
    {
        from: { x: 1948.4307861328125, y: 3916.800048828125, z: 38.833740234375, rot: -155.9055155041175 },
        to: { x: 2037.82421875, y: 3759.428466796875, z: 40.2490234375, rot: -147.40158847799316 },
        persCoord: { x: 1989.7318115234375, y: 3849.91650390625, z: 32.3634033203125, rot: -155.90551550411755 },
        duration: 30000
    },
    {
        from: { x: -1421.7626953125, y: 4306.1669921875, z: 34.4359130859375, rot: -73.70079423899658 },
        to: { x: -1421.7626953125, y: 4306.1669921875, z: 34.4359130859375, rot: -73.70079423899658 },
        persCoord: { x: -1235.6966552734375, y: 4361.38037109375, z: 8.015380859375, rot: -79.37008347653894 },
        duration: 30000
    },
    {
        from: { x: 405.70550537109375, y: 6575.72314453125, z: 32.818359375, rot: -107.7165433246291 },
        to: { x: 644.1494750976562, y: 6526.89208984375, z: 31.79052734375, rot: -102.04725408708674 },
        persCoord: { x: 522.0791015625, y: 6552.52734375, z: 27.4095458984375, rot: -102.04725408708674 },
        duration: 30000
    },
    {
        from: { x: -1391.90771484375, y: 2417.419677734375, z: 58.2109375, rot: 150.2362262665751 },
        to: { x: -1563.81103515625, y: 2136.38232421875, z: 70.0732421875, rot: 144.56692336865447 },
        persCoord: { x: -1487.7098388671875, y: 2274.32958984375, z: 32.5487060546875, rot: 153.07087771553552 },
        duration: 30000
    },
    {
        from: { x: -1313.7626953125, y: -48.369232177734375, z: 62.3560791015625, rot: -121.88976641848501 },
        to: { x: -1062.4219970703125, y: -182.37362670898438, z: 56.6102294921875, rot: -116.22047718094265 },
        persCoord: { x: -1221.006591796875, y: -100.9054946899414, z: 42.5238037109375, rot: -110.55118794340028 },
        duration: 30000
    },
    {
        from: { x: -848.4132080078125, y: 289.22637939453125, z: 91.202880859375, rot: 0 },
        to: { x: -854.2549438476562, y: 434.72967529296875, z: 93.6461181640625, rot: 2.8346456859882396 },
        persCoord: { x: -825.1516723632812, y: 350.1098937988281, z: 86.788330078125, rot: -147.40158847799316 },
        duration: 30000
    },
    {
        from: { x: 1181.82861328125, y: -747.7977905273438, z: 70.0732421875, rot: 42.519686357040655 },
        to: { x: 1035.3099365234375, y: -623.076904296875, z: 70.03955078125, rot: 51.02362704354337 },
        persCoord: { x: 1113.5604248046875, y: -649.7933959960938, z: 57.7391357421875, rot: 0 },
        duration: 30000
    }
];

let currentCameraIndex = -1;
const getRandomCameraIndex = () => {
    if (coordsCamera.length <= 1)
        return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * coordsCamera.length);
    } while (newIndex === currentCameraIndex);
    return newIndex;
};
const startNextCameraMovement = async () => {
    if (!cameraState.isSpanActive)
        return;
    cameraState.isTransition = true;
    try {
        if (currentCameraIndex !== -1) {
            mp.game.cam.doScreenFadeOut(1500);
            await waitWithCancel(1500);
        }
        if (!cameraState.isSpanActive)
            return;
        currentCameraIndex = getRandomCameraIndex();
        const path = coordsCamera[currentCameraIndex];
        startCamMoving(path);
        mp.game.cam.doScreenFadeIn(1000);
        await waitWithCancel(1000);
        if (!cameraState.isSpanActive)
            return;
        const visibleDuration = path.duration - 3000;
        if (visibleDuration > 0) {
            await waitWithCancel(visibleDuration);
        }
        cameraState.isTransition = false;
        startNextCameraMovement();
    }
    catch (e) {
    }
};
const waitWithCancel = (ms) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            resolve();
        }, ms);
        cameraState.timeout = timer;
        const checkInterval = setInterval(() => {
            if (!cameraState.isSpanActive) {
                clearSafeTimers(timer, checkInterval);
                reject("Cancelled");
            }
        }, 100);
        cameraState.interval = checkInterval;
    });
};
const clearSafeTimers = (timer, interval) => {
    try {
        if (timer && typeof timer === 'object') {
            clearTimeout(timer);
        }
    }
    catch (e) {
        mp.console.logError(`Timer clear err: ${e}`);
    }
    try {
        if (interval && typeof interval === 'object') {
            clearInterval(interval);
        }
    }
    catch (e) {
        mp.console.logError(`Interval clear err: ${e}`);
    }
    if (cameraState.timeout === timer)
        cameraState.timeout = null;
    if (cameraState.interval === interval)
        cameraState.interval = null;
};

const cameraState = {
    currentIndex: -1,
    isSpanActive: false,
    isTransition: false,
    timeout: null,
    interval: null
};
const enableAuth = () => {
    cameraState.isSpanActive = true;
    cameraState.isTransition = false;
    rpc.call('execute', [`window.App.authReducer.showAuth()`]);
    rpc.callServer('client:authPlayerVisible', [false]);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.disableScreenblurFade();
    mp.players.local.freezePosition(true);
    mp.gui.cursor.visible = true;
    startNextCameraMovement();
    if (mp.storage.data.auth !== undefined) {
        rpc.callBrowser('client:auth:saveLogin', [mp.storage.data.auth.login]);
    }
    rpc.register('server:auth:saveLogin', (login) => {
        mp.storage.data.auth = {
            login: login
        };
        mp.storage.flush();
    });
};
const disableAuth = () => {
    cameraState.isSpanActive = false;
    try {
        if (cameraState.timeout) {
            clearTimeout(cameraState.timeout);
            cameraState.timeout = null;
        }
        if (cameraState.interval) {
            clearInterval(cameraState.interval);
            cameraState.interval = null;
        }
    }
    catch (e) {
        console.error("Disable auth timer error:", e);
    }
    mp.gui.cursor.visible = false;
    if (cameraState.isTransition) {
        mp.game.cam.doScreenFadeIn(0);
        stopCamMoving();
    }
    if (cameraState.timeout) {
        clearTimeout(cameraState.timeout);
        cameraState.timeout = null;
    }
    stopCamMoving();
    showLoading(3000);
    rpc.call('execute', [`window.App.chatReducer.showChat()`]);
    rpc.call('execute', [`window.App.authReducer.hideAuth()`]);
    setTimeout(() => {
        rpc.callServer('client:authPlayerVisible', [true]);
        mp.game.ui.displayRadar(true);
        mp.players.local.freezePosition(false);
    }, 3000);
};
rpc.register('cef:authEnabled', () => {
    enableAuth();
});
rpc.register('cef:authDisabled', () => {
    disableAuth();
    global.loginPlayer = true;
});

rpc.register('sendNotify', (typeNotify, msg, duration, pos) => {
    mp.console.logWarning(`Мы приняли на клиенте уведомление с сервера: ${msg}`);
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
    rpc.call('clientCmd', [`[CLIENT][RPC] Формируемый JS код:', ${code}`]);
    rpc.call('execute', [code]);
});

mp.events.add('browserDomReady', async (player) => {
    rpc.call('execute', [`window.App.welcomeReducer.showWelcome()`]);
    mp.gui.cursor.visible = true;
    await setTimeout(() => {
        rpc.call('cef:authEnabled', []);
        setTimeout(() => {
            rpc.call('execute', [`window.App.welcomeReducer.hideWelcome()`]);
        }, 200);
    }, 7100);
});

const CHAT_MESSAGE_EVENT = 'chat:message';
const buffer = [];
let loaded = false;
let opened = false;
const toggleChat = (state) => {
    rpc.callBrowser('chatActive', [state]);
};
const addMsg = (name, text, showTime, tile) => {
    mp.console.logError(`const addMsg: ${text}`);
    if (name) {
        rpc.callBrowser('addMsg', [name, text, showTime, tile]);
    }
    else {
        rpc.callBrowser('addString', [text, showTime, tile]);
    }
};
rpc.register('chatloaded', () => {
    for (const msg of buffer) {
        addMsg(msg.name, msg.text, msg.showTime, msg.tile);
    }
    loaded = true;
});
rpc.register('chatmessage', (text) => {
    mp.console.logError(`register:chatmessage: ${text}`);
    //rpc.call(CHAT_MESSAGE_EVENT, [text])
    rpc.callServer(CHAT_MESSAGE_EVENT, [text]);
    toggleChat(true);
    opened = true;
});
const pushMsg = (name, text, showTime, tile) => {
    if (!loaded) {
        mp.console.logError(`pushMsg (no loaded): ${text}`);
        buffer.push({ name, text, showTime, tile });
    }
    else {
        mp.console.logError(`pushMsg (loaded): ${text}`);
        addMsg(name, text, showTime, tile);
    }
};
const pushLine = (text, showTime, tile) => {
    pushMsg(null, text, showTime, tile);
};
rpc.register(CHAT_MESSAGE_EVENT, pushMsg);
mp.keys.bind(Keys.VK_T, false, () => {
    if (loaded && !opened) {
        opened = true;
        toggleChat(true);
        rpc.callBrowser('openChat', [false]);
    }
});
mp.keys.bind(Keys.VK_OEM_2, false, () => {
    if (loaded && !opened) {
        opened = true;
        toggleChat(true);
        rpc.callBrowser('openChat', [true]);
    }
});
mp.keys.bind(Keys.VK_ESCAPE, false, () => {
    if (loaded && opened) {
        opened = false;
        rpc.callBrowser('closeChat');
        toggleChat(false);
    }
});
mp.keys.bind(Keys.VK_ENTER, false, () => {
    if (loaded && opened) {
        opened = false;
        rpc.callBrowser('closeChat');
        toggleChat(false);
    }
});
pushLine(`Ваше приключение начинается на 🌟 {FCD53F}<b>REDSTAR ROLEPLAY!</b>`, false, 'hello');

rpc.browser = mp.browsers.new('package://cef/index.html');
mp.events.add('guiReady', () => {
    mp.gui.chat.show(false);
    mp.console.logInfo('guiReady');
    rpc.register('execute', (commands) => {
        const commandsArray = Array.isArray(commands) ? commands : [commands];
        mp.console.logWarning(`Принято команд: ${commandsArray.length}`);
        rpc.callBrowser('client:executeCode', commandsArray);
    });
});
mp.keys.bind(Keys.VK_OEM_3, false, () => {
    mp.gui.cursor.visible = !mp.gui.cursor.visible;
});
rpc.register('clientCmd', (text) => {
    mp.console.logInfo(`[CEF]: ${text}`);
});
rpc.register('cef:setActiveAmbient', (toggle) => {
    mp.storage.data.activeAmbient = toggle;
    mp.storage.flush();
});
rpc.register('cef:changeLanguage', (lang) => {
    mp.storage.data.language = lang;
    mp.storage.flush();
});
rpc.register('cursorVisible', (toggle) => {
    mp.gui.cursor.visible = toggle;
});

mp.keys.bind(Keys.VK_F2, true, () => {
    rpc.callServer('playerKnockout');
});
mp.keys.bind(Keys.VK_F6, true, () => {
    rpc.callServer('playerReborn');
});
mp.keys.bind(Keys.VK_F5, true, () => {
    const playerPos = mp.players.local.position;
    mp.vehicles.new(mp.game.joaat("22stinger"), new mp.Vector3(playerPos.x + 2, playerPos.y, playerPos.z), {
        numberPlate: "PATRIOT",
        color: [[22, 21, 35], [22, 21, 35]]
    });
});
const getRandomChance = () => {
    const percent = Math.floor(Math.random() * 66);
    const luck = Math.random() * 100 < percent;
    return [percent, luck];
};
mp.events.add('playerDeath', async (player, reason, killer) => {
    const [chance, luck] = getRandomChance();
    await rpc.callServer('client:getFormatedDateTime', [true, true, true]);
    rpc.callServer('playerKnockout');
    rpc.call('execute', [`window.App.deathReducer.showDeath('Здесь будет никнейм', null)`]);
    rpc.call('execute', [`window.App.chatReducer.hideChat()`]);
    rpc.callBrowser('client:chanceReborn', [chance, luck]);
    const playerPos = mp.players.local.position;
    const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false);
    rpc.callServer('client:playerDeath', [[player.position.x, player.position.y, getGroundZ]]);
});
rpc.register('server:getFormatedDateTime', (time) => {
});
rpc.register('cef:death:selectedFate', () => {
    mp.gui.cursor.visible = false;
});

// PLAYER
rpc.register('player:freeze', (toggle) => {
    mp.players.local.freezePosition(toggle);
});
rpc.register('player:isCollision', (toggle) => {
    mp.players.local.setCollision(toggle, toggle);
});
rpc.register('player:godmode', (toggle) => {
    mp.players.local.setInvincible(toggle);
});
// GRAPHICS
rpc.register('graphics:startScreenEffect', (name, duration, looped) => {
    mp.game.graphics.startScreenEffect(name, duration, looped);
});
rpc.register('graphics:stopAllScreenEffects', () => {
    mp.game.graphics.stopAllScreenEffects();
});
// UI
rpc.register('ui:displayRadar', (toggle) => {
    mp.game.ui.displayRadar(toggle);
});
rpc.register('ui:setPauseMenuActive', (toggle) => {
    mp.game.ui.setPauseMenuActive(toggle);
});
// GUI
rpc.register('gui:cursorVisible', (toggle) => {
    mp.gui.cursor.visible = toggle;
});

mp.events.add('playerReady', (player) => {
    rpc.callBrowser('client:setActiveAmbient', [mp.storage.data.activeAmbient]);
    mp.game.gameplay.setFadeOutAfterDeath(false);
    mp.game.ui.displayCash(false);
    mp.game.ui.displayAreaName(false);
    mp.game.ui.displayAmmoThisFrame(false);
    if (mp.storage.data.language !== undefined) {
        rpc.callBrowser('client:setLanguage', [mp.storage.data.language]);
    }
    else {
        rpc.callBrowser('client:setLanguage', ['ru']);
    }
});

if (openInterfaces.has('Auth')) {
    mp.console.logInfo('Меню авторизации ВКЛЮЧЕНО!');
}
else {
    mp.console.logInfo('Меню авторизации ОТКЛЮЧЕНО!');
}
