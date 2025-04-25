'use strict';

var Environment;
(function (Environment) {
    Environment["BROWSER"] = "BROWSER";
    Environment["CLIENT"] = "CLIENT";
    Environment["SERVER"] = "SERVER";
    Environment["UNKNOWN"] = "UNKNOWN";
})(Environment || (Environment = {}));
var Events;
(function (Events) {
    Events["LOCAL_EVENT_LISTENER"] = "__rpc:listener";
    Events["SERVER_EVENT_LISTENER"] = "__rpc:serverListener";
    Events["EVENT_RESPONSE"] = "__rpc:response";
})(Events || (Events = {}));
var Errors;
(function (Errors) {
    Errors["EVENT_NOT_REGISTERED"] = "Event not registered";
    Errors["UNKNOWN_ENVIRONMENT"] = "Unknown environment";
    Errors["NO_BROWSER"] = "You need to initialize browser first";
    Errors["EVENT_RESPONSE_TIMEOUT"] = "Response was timed out after 10s of inactivity";
})(Errors || (Errors = {}));
class Utils {
    static getEnvironment() {
        if ('joaat' in mp)
            return Environment.SERVER;
        if ('game' in mp &&
            'joaat' in mp.game)
            return Environment.CLIENT;
        if (window && 'mp' in window)
            return Environment.BROWSER;
        return Environment.UNKNOWN;
    }
    static prepareExecution(data) {
        return JSON.parse(data);
    }
    static prepareTransfer(data) {
        return JSON.stringify(data);
    }
    static generateUUID() {
        let uuid = '', random;
        for (let i = 0; i < 32; i++) {
            random = (Math.random() * 16) | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
        }
        return uuid;
    }
    static generateResponseEventName(uuid) {
        return `${Events.EVENT_RESPONSE}_${uuid}`;
    }
    static errorUnknownEnvironment(environment) {
        if (environment === Environment.UNKNOWN)
            throw new Error(Errors.UNKNOWN_ENVIRONMENT);
    }
}
var RPCEventType;
(function (RPCEventType) {
    RPCEventType["EVENT"] = "event";
    RPCEventType["RESPONSE"] = "response";
})(RPCEventType || (RPCEventType = {}));
const nativeClientEvents = new Set([
    'browserCreated',
    'browserDomReady',
    'browserLoadingFailed',
    'playerEnterCheckpoint',
    'playerExitCheckpoint',
    'consoleCommand',
    'click',
    'playerChat',
    'playerCommand',
    'playerDeath',
    'playerJoin',
    'playerQuit',
    'playerReady',
    'playerResurrect',
    'playerRuleTriggered',
    'playerSpawn',
    'playerWeaponShot',
    'dummyEntityCreated',
    'dummyEntityDestroyed',
    'entityControllerChange',
    'incomingDamage',
    'outgoingDamage',
    'meleeActionDamage',
    'playerEnterVehicle',
    'playerLeaveVehicle',
    'playerStartTalking',
    'playerStopTalking',
    'entityStreamIn',
    'entityStreamOut',
    'render',
    'playerCreateWaypoint',
    'playerReachWaypoint',
    'playerEnterColshape',
    'playerExitColshape',
    'explosion',
    'projectile',
    'uncaughtException',
    'unhandledRejection',
]);
const nativeServerEvents = new Set([
    'entityCreated',
    'entityModelChange',
    'incomingConnection',
    'packagesLoaded',
    'playerChat',
    'playerCommand',
    'playerDamage',
    'playerDeath',
    'playerEnterCheckpoint',
    'playerEnterColshape',
    'playerEnterVehicle',
    'playerExitCheckpoint',
    'playerExitColshape',
    'playerExitVehicle',
    'playerJoin',
    'playerQuit',
    'playerReachWaypoint',
    'playerReady',
    'playerSpawn',
    'playerStartEnterVehicle',
    'playerStartExitVehicle',
    'playerStreamIn',
    'playerStreamOut',
    'playerWeaponChange',
    'serverShutdown',
    'trailerAttached',
    'vehicleDamage',
    'vehicleDeath',
    'vehicleHornToggle',
    'vehicleSirenToggle',
]);

class Wrapper {
    environment_ = Environment.UNKNOWN;
    state_;
    console_ = this.environment_ === Environment.CLIENT
        ? mp.console.logInfo
        : console.log;
    debug_ = false;
    forceBrowserDevMode_ = false;
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        if (options.forceBrowserDevMode) {
            this.environment_ = Environment.UNKNOWN;
            this.state_ = window;
        }
        else {
            this.environment_ = Utils.getEnvironment();
            this.state_ =
                this.environment_ === Environment.BROWSER ? window : global;
        }
        this.forceBrowserDevMode_ = !!options.forceBrowserDevMode;
    }
    verifyEvent_(data) {
        let rpcData = typeof data === 'string' ? Utils.prepareExecution(data) : data;
        if (!this.state_[rpcData.eventName]) {
            rpcData.knownError = Errors.EVENT_NOT_REGISTERED;
        }
        return rpcData;
    }
    triggerError_(rpcData, error) {
        const errorMessage = [
            `${rpcData.knownError}`,
            `Caller: ${rpcData.calledFrom}`,
            `Receiver: ${this.environment_}`,
            `Event: ${rpcData.eventName}`,
        ];
        if (error) {
            errorMessage.push(`Additional Info: ${error}`);
        }
        throw new Error(errorMessage.join('\n | '));
    }
    log(method, eventName, ...args) {
        if (this.debug_)
            this.console_('RPC | [' + method + '] ' + eventName + ':', ...args);
    }
}

class Server extends Wrapper {
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        super(options);
        if (!!options.forceBrowserDevMode)
            return;
        mp.events.add(Events.SERVER_EVENT_LISTENER, async (player, dataRaw) => {
            this.emit(player, dataRaw);
        });
    }
    _resolveEmitDestination(player, dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        switch (state.calledTo) {
            case Environment.SERVER:
                this.emit(player, dataRaw);
                break;
            default:
                this.emitClient(player, dataRaw);
                break;
        }
    }
    emitClient(player, dataRaw) {
        player.call(Events.LOCAL_EVENT_LISTENER, [dataRaw]);
    }
    async emit(player, dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        const responseEventName = Utils.generateResponseEventName(state.uuid);
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        const response = await this.state_[state.eventName](player, ...(Array.isArray(state.data) ? state.data : []));
        const responseState = {
            uuid: Utils.generateUUID(),
            eventName: state.eventName,
            calledFrom: Environment.SERVER,
            calledTo: state.calledFrom,
            knownError: undefined,
            data: response,
            type: RPCEventType.RESPONSE,
        };
        switch (state.calledFrom) {
            case Environment.SERVER:
                try {
                    mp.events.call(responseEventName, Utils.prepareTransfer(responseState));
                }
                catch (e) {
                }
                break;
            default:
                try {
                    player.call(responseEventName, [
                        Utils.prepareTransfer(responseState),
                    ]);
                }
                catch (e) {
                }
                break;
        }
    }
}

class Client extends Wrapper {
    _browser = null;
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        super(options);
    }
    set browser(browser) {
        this._browser = browser;
    }
    _resolveEmitDestination(dataRaw) {
        const state = Utils.prepareExecution(dataRaw);
        switch (state.calledTo) {
            case Environment.SERVER:
                this.emitServer(dataRaw);
                break;
            case Environment.BROWSER:
                this.emitBrowser(dataRaw);
                break;
            case Environment.CLIENT:
                this.emit(state);
                break;
            default:
                this.triggerError_(state, Errors.UNKNOWN_ENVIRONMENT);
                break;
        }
    }
    async emit(state) {
        this.errorNoBrowser();
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        const responseEventName = Utils.generateResponseEventName(state.uuid);
        const response = await this.state_[state.eventName](...(Array.isArray(state.data) ? state.data : []));
        const responseState = {
            uuid: Utils.generateUUID(),
            eventName: state.eventName,
            calledFrom: state.calledTo,
            calledTo: state.calledFrom,
            knownError: undefined,
            data: response,
            type: RPCEventType.RESPONSE,
        };
        switch (state.calledFrom) {
            case Environment.CLIENT:
                try {
                    mp.events.call(responseEventName, Utils.prepareTransfer(responseState));
                }
                catch (e) {
                }
                break;
            case Environment.SERVER:
                try {
                    mp.events.callRemote(responseEventName, Utils.prepareTransfer(responseState));
                }
                catch (e) {
                }
                break;
            case Environment.BROWSER:
                try {
                    this._browser.call(responseEventName, Utils.prepareTransfer(responseState));
                }
                catch (e) {
                }
                break;
        }
    }
    emitServer(dataRaw) {
        this.errorNoBrowser();
        const state = Utils.prepareExecution(dataRaw);
        if (state.calledFrom === Environment.BROWSER) {
            const responseEventName = Utils.generateResponseEventName(state.uuid);
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                mp.events.remove(responseEventName);
            }, 10000);
            mp.events.add(responseEventName, (responseDataRaw) => {
                this._browser.call(responseEventName, responseDataRaw);
                clearTimeout(timeout);
                mp.events.remove(responseEventName);
            });
        }
        mp.events.callRemote(Events.SERVER_EVENT_LISTENER, dataRaw);
    }
    emitBrowser(dataRaw) {
        this.errorNoBrowser();
        const state = Utils.prepareExecution(dataRaw);
        if (state.calledFrom === Environment.SERVER) {
            const responseEventName = Utils.generateResponseEventName(state.uuid);
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                mp.events.remove(responseEventName);
            }, 10000);
            mp.events.add(responseEventName, (responseDataRaw) => {
                mp.events.callRemote(responseEventName, responseDataRaw);
                clearTimeout(timeout);
                mp.events.remove(responseEventName);
            });
        }
        this._browser.call(Events.LOCAL_EVENT_LISTENER, dataRaw);
    }
    errorNoBrowser() {
        if (!this._browser)
            throw new Error(Errors.NO_BROWSER);
    }
}

class Browser extends Wrapper {
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        super(options);
    }
    _resolveEmitDestination(dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        switch (state.calledTo) {
            case Environment.BROWSER:
                this.emit(dataRaw);
                break;
            default:
                this.emitClient(dataRaw);
                break;
        }
    }
    emitClient(dataRaw) {
        mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw);
    }
    async emit(dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        const responseEventName = Utils.generateResponseEventName(state.uuid);
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        const response = await this.state_[state.eventName](...(Array.isArray(state.data) ? state.data : []));
        const responseState = {
            uuid: Utils.generateUUID(),
            eventName: state.eventName,
            calledFrom: Environment.SERVER,
            calledTo: state.calledFrom,
            knownError: undefined,
            data: response,
            type: RPCEventType.RESPONSE,
        };
        const responseDataRaw = Utils.prepareTransfer(responseState);
        switch (state.calledFrom) {
            case Environment.BROWSER:
                try {
                    mp.events.call(responseEventName, responseDataRaw);
                }
                catch (e) {
                }
                break;
            default:
                try {
                    mp.trigger(responseEventName, responseDataRaw);
                }
                catch (e) {
                }
                break;
        }
    }
}

class Rpc extends Wrapper {
    _server;
    _client;
    _browser;
    constructor(options = {
        forceBrowserDevMode: false,
        debugLogs: false,
    }) {
        super(options);
        this._server = new Server(options);
        this._client = new Client(options);
        this._browser = new Browser(options);
        this.debug_ = !!options.debugLogs;
        if (options.forceBrowserDevMode)
            return;
        if (this.environment_ === Environment.UNKNOWN)
            throw new Error(Errors.UNKNOWN_ENVIRONMENT);
        mp.events.add(Events.LOCAL_EVENT_LISTENER, async (player, dataRaw) => {
            switch (this.environment_) {
                case Environment.SERVER:
                    this._server._resolveEmitDestination(player, dataRaw);
                    break;
                case Environment.CLIENT:
                    dataRaw = player;
                    this._client._resolveEmitDestination(dataRaw);
                    break;
                case Environment.BROWSER:
                    dataRaw = player;
                    this._browser._resolveEmitDestination(dataRaw);
                    break;
            }
        });
    }
    set browser(browser) {
        this._client.browser = browser;
    }
    register(eventName, cb) {
        this.log('register', eventName, cb);
        if (this.forceBrowserDevMode_)
            return;
        Utils.errorUnknownEnvironment(this.environment_);
        if ((this.environment_ === Environment.CLIENT &&
            nativeClientEvents.has(eventName)) ||
            (this.environment_ === Environment.SERVER &&
                nativeServerEvents.has(eventName))) {
            mp.events.add(eventName, cb);
        }
        else {
            this.state_[eventName] = cb;
        }
    }
    unregister(eventName) {
        this.log('unregister', eventName);
        if (this.forceBrowserDevMode_)
            return;
        Utils.errorUnknownEnvironment(this.environment_);
        delete this.state_[eventName];
    }
    async callClient(playerOrEventName, eventNameOrArgs, args) {
        _is1StParamPlayer(playerOrEventName)
            ? this.log('callClient', eventNameOrArgs, playerOrEventName, eventNameOrArgs, args)
            : this.log('callClient', playerOrEventName, eventNameOrArgs);
        if (this.forceBrowserDevMode_)
            return;
        Utils.errorUnknownEnvironment(this.environment_);
        function _is1StParamPlayer(x) {
            return typeof x === 'object';
        }
        function _is2NdParamEventName(x) {
            return typeof x === 'string';
        }
        if (this.environment_ === Environment.CLIENT) {
            return await this.call(playerOrEventName, args);
        }
        if (this.environment_ === Environment.SERVER &&
            _is1StParamPlayer(playerOrEventName) &&
            _is2NdParamEventName(eventNameOrArgs)) {
            const state = {
                uuid: Utils.generateUUID(),
                eventName: eventNameOrArgs,
                calledTo: Environment.CLIENT,
                calledFrom: this.environment_,
                knownError: undefined,
                data: args,
                type: RPCEventType.EVENT,
            };
            const dataRaw = Utils.prepareTransfer(state);
            playerOrEventName.call(Events.LOCAL_EVENT_LISTENER, [dataRaw]);
            return (await this.responseHandler(state.uuid)).data;
        }
        if (this.environment_ === Environment.BROWSER &&
            !_is1StParamPlayer(playerOrEventName) &&
            !_is2NdParamEventName(eventNameOrArgs)) {
            const state = {
                uuid: Utils.generateUUID(),
                eventName: playerOrEventName,
                calledTo: Environment.CLIENT,
                calledFrom: this.environment_,
                knownError: undefined,
                data: eventNameOrArgs,
                type: RPCEventType.EVENT,
            };
            const dataRaw = Utils.prepareTransfer(state);
            mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw);
            return (await this.responseHandler(state.uuid)).data;
        }
    }
    async callServer(eventName, args) {
        this.log('callServer', eventName, args);
        if (this.forceBrowserDevMode_)
            return undefined;
        Utils.errorUnknownEnvironment(this.environment_);
        const state = {
            uuid: Utils.generateUUID(),
            eventName,
            calledTo: Environment.SERVER,
            calledFrom: this.environment_,
            knownError: undefined,
            data: args,
            type: RPCEventType.EVENT,
        };
        const dataRaw = Utils.prepareTransfer(state);
        switch (this.environment_) {
            case Environment.SERVER:
                return this.callSelf(state);
            case Environment.CLIENT:
                mp.events.callRemote(Events.LOCAL_EVENT_LISTENER, dataRaw);
                break;
            case Environment.BROWSER:
                mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw);
                break;
        }
        return (await this.responseHandler(state.uuid)).data;
    }
    async callBrowser(playerOrEventName, eventNameOrArgs, args) {
        _is1StParamPlayer(playerOrEventName)
            ? this.log('DEV callClient', eventNameOrArgs, playerOrEventName, eventNameOrArgs, args)
            : this.log('DEV callClient', playerOrEventName, eventNameOrArgs);
        if (this.forceBrowserDevMode_)
            return;
        Utils.errorUnknownEnvironment(this.environment_);
        function _is1StParamPlayer(x) {
            return typeof x === 'object';
        }
        function _is2NdParamEventName(x) {
            return typeof x === 'string';
        }
        const state = {
            uuid: Utils.generateUUID(),
            eventName: !_is1StParamPlayer(playerOrEventName)
                ? playerOrEventName
                : _is2NdParamEventName(eventNameOrArgs)
                    ? eventNameOrArgs
                    : '',
            calledTo: Environment.BROWSER,
            calledFrom: this.environment_,
            knownError: undefined,
            data: _is1StParamPlayer(playerOrEventName) ? args : eventNameOrArgs,
            type: RPCEventType.EVENT,
        };
        const dataRaw = Utils.prepareTransfer(state);
        switch (this.environment_) {
            case Environment.BROWSER:
                return this.callSelf(state);
            case Environment.CLIENT:
                mp.events.callRemote(Events.LOCAL_EVENT_LISTENER, dataRaw);
                break;
            case Environment.SERVER:
                playerOrEventName.call(Events.LOCAL_EVENT_LISTENER, [dataRaw]);
                break;
        }
        return (await this.responseHandler(state.uuid)).data;
    }
    async call(eventName, args) {
        this.log('call', eventName, args);
        if (this.forceBrowserDevMode_)
            return undefined;
        Utils.errorUnknownEnvironment(this.environment_);
        let state = {
            uuid: Utils.generateUUID(),
            eventName,
            calledTo: this.environment_,
            calledFrom: this.environment_,
            knownError: undefined,
            data: args,
            type: RPCEventType.EVENT,
        };
        return await this.callSelf(state);
    }
    async callSelf(state) {
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        return await this.state_[state.eventName](...state.data);
    }
    async responseHandler(uuid) {
        const responseEventName = Utils.generateResponseEventName(uuid);
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                mp.events.remove(responseEventName);
                reject(Errors.EVENT_RESPONSE_TIMEOUT);
            }, 10000);
            mp.events.add(responseEventName, (player, dataRaw) => {
                switch (this.environment_) {
                    case Environment.SERVER:
                        resolve(Utils.prepareExecution(dataRaw));
                        clearTimeout(timeout);
                        mp.events.remove(responseEventName);
                        break;
                    case Environment.CLIENT:
                        dataRaw = player;
                        resolve(Utils.prepareExecution(dataRaw));
                        clearTimeout(timeout);
                        mp.events.remove(responseEventName);
                        break;
                    case Environment.BROWSER:
                        dataRaw = player;
                        resolve(Utils.prepareExecution(dataRaw));
                        clearTimeout(timeout);
                        mp.events.remove(responseEventName);
                        break;
                }
            });
        });
    }
}

const rpc = new Rpc({
    debugLogs: false,
});

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
mp.keys.bind(Keys.VK_OEM_3, true, () => {
    setTimeout(() => {
        mp.gui.cursor.show(true, true);
    }, 100);
});

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

const enableAuth = () => {
    rpc.call('execute', [`window.App.authReducer.showAuth()`]);
    rpc.callServer('client:authPlayerVisible', [false]);
    mp.game.ui.displayRadar(false);
    mp.players.local.freezePosition(true);
    setTimeout(() => {
        mp.gui.cursor.show(true, true);
    }, 500);
    if (mp.storage.data.auth !== undefined) {
        rpc.callBrowser('client:auth:saveLogin', [mp.storage.data.auth.login]);
    }
    rpc.register('server:auth:saveLogin', (login) => {
        mp.storage.data.auth = {
            login: login
        };
        mp.storage.flush();
    });
    rpc.register('client:auth:saveLogin', (login) => {
        mp.storage.data.authLogin = login;
    });
};
const disableAuth = () => {
    setTimeout(() => {
        mp.gui.cursor.show(false, false);
    }, 500);
    showLoading(5000);
    rpc.call('execute', [`window.App.authReducer.hideAuth()`]);
    setTimeout(() => {
        rpc.callServer('client:authPlayerVisible', [true]);
        mp.game.ui.displayRadar(true);
        mp.players.local.freezePosition(false);
    }, 5000);
};
rpc.register('cef:authEnabled', () => {
    mp.console.logWarning('вызов enabled');
    enableAuth();
});
rpc.register('cef:authDisabled', () => {
    disableAuth();
});

const CHAT_MESSAGE_EVENT = 'chat:message';
const buffer = [];
let loaded = false;
let opened = false;
const toggleChat = (state) => {
    rpc.callBrowser('chatActive', [state]);
};
const addMsg = (name, text, showTime, tile) => {
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
    rpc.call(CHAT_MESSAGE_EVENT, [text]);
    rpc.callServer(CHAT_MESSAGE_EVENT, [text]);
    toggleChat(true);
    opened = true;
});
const pushMsg = (name, text, showTime, tile) => {
    if (!loaded) {
        buffer.push({ name, text, showTime, tile });
    }
    else {
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

rpc.browser = mp.browsers.new('package://cef/index.html');
mp.events.add('guiReady', () => {
    mp.gui.chat.show(false);
    mp.console.logInfo('guiReady');
    rpc.register('execute', (code) => {
        mp.console.logWarning(`На клиенте мы приняли с клиента код и отправляем в CEF: ${code}`);
        rpc.callBrowser('client:executeCode', [code]);
    });
    rpc.call('cef:authEnabled', []);
});
rpc.register('clientCmd', (text) => {
    mp.console.logInfo(`[CEF]: ${text}`);
});

if (openInterfaces.has('Auth')) {
    mp.console.logInfo('Меню авторизации ВКЛЮЧЕНО!');
}
else {
    mp.console.logInfo('Меню авторизации ОТКЛЮЧЕНО!');
}
