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
    // todo type for dev browser
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
    // 'entityDestroyed',
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
    // checks if event is available (registered) in current environment
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

/**
 * NOT INTENDED FOR OUT-OF-CONTEXT USE
 */
class Server extends Wrapper {
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        super(options);
        if (!!options.forceBrowserDevMode)
            return;
        // specific event to save player in context as it is not available on server -> server calls
        mp.events.add(Events.SERVER_EVENT_LISTENER, async (player, dataRaw) => {
            this.emit(player, dataRaw);
        });
    }
    /**
     * NOT INTENDED FOR OUT-OF-CONTEXT USE
     */
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
    // called to server
    async emit(player, dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        const responseEventName = Utils.generateResponseEventName(state.uuid);
        // check availability
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        // execute + generate response
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
        // send response
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

/**
 * NOT INTENDED FOR OUT-OF-CONTEXT USE
 */
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
    /**
     * NOT INTENDED FOR OUT-OF-CONTEXT USE
     */
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
    // called to client
    async emit(state) {
        this.errorNoBrowser();
        // check availability
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        // execute + generate response
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
        // send response
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
    // called to server
    emitServer(dataRaw) {
        this.errorNoBrowser();
        const state = Utils.prepareExecution(dataRaw);
        // if event is called from browser we will forward response through client via this
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
    // called to browser
    emitBrowser(dataRaw) {
        this.errorNoBrowser();
        const state = Utils.prepareExecution(dataRaw);
        // if event is called from server we will forward response through client via this
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

/**
 * NOT INTENDED FOR OUT-OF-CONTEXT USE
 */
class Browser extends Wrapper {
    constructor(options = {
        forceBrowserDevMode: false,
    }) {
        super(options);
    }
    /**
     * NOT INTENDED FOR OUT-OF-CONTEXT USE
     */
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
    // called to browser
    async emit(dataRaw) {
        let state = Utils.prepareExecution(dataRaw);
        const responseEventName = Utils.generateResponseEventName(state.uuid);
        // check availability
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        // execute + generate response
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
        // send response
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
    /**
     * Registers a callback function for a specified event
     *
     * @template CallbackArguments - An array of argument types that the callback function accepts
     * @template CallbackReturn - The type of the value returned by the callback function
     * @template EventName - A string representing the event name or union of names
     *
     * @param {EventName} eventName - The name of the event to register the callback for
     * @param {(...args: CallbackArguments) => CallbackReturn} cb - The callback function that is called when the event is triggered
     *
     * @returns {void}
     *
     * @example
     * register<[PlayerMp]>('playerJoin', (player) => {
     *   console.log(`Connected: ${player.socialClub}`)
     * })
     */
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
    /**
     * Unregisters callback function for a specified event
     *
     * @template EventName - A string representing the event name or union of names
     *
     * @param {EventName} eventName - The name of the event to register the callback for
     *
     * @returns {void}
     *
     * @example
     * unregister('playerJoin')
     */
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
            // client
            return await this.call(playerOrEventName, args);
        }
        // server
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
        // browser
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
    /**
     * Calls a server-side event from browser or client
     *
     * @template Arguments - An array of argument types to be passed to the server event
     * @template EventName - A string representing the server event name or union of names
     * @template Return - The type of the value returned by the server event
     *
     * @param {EventName} eventName - The name of the server event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the server event
     * @returns {Promise<Return>} A promise resolving to the return value of the server event
     *
     * @example
     * // Calls an event on server
     * callServer<[], string, object>('onDataRequest').then(response => {
     *   console.log(`Received: ${response}`) //             ^ object
     * })
     */
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
    /**
     * Calls an event in current environment
     *
     * @template Arguments - An array of argument types to be passed to the event
     * @template EventName - A string representing the event name or union of names
     * @template Return - The type of the value returned by the event
     *
     * @param {EventName} eventName - The name of the event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the event
     * @returns {Promise<Return>} A promise resolving to the return value of the event
     *
     * @example
     * // Calls an event in current environment
     * call<[], string, number>('getSomething').then(response => {
     *   console.log(`Received: ${response}`) //      ^ number
     * })
     */
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
    /**
     * redirects an event in cases of it calling its own environment
     */
    async callSelf(state) {
        state = this.verifyEvent_(state);
        if (state.knownError) {
            this.triggerError_(state, state.knownError);
        }
        return await this.state_[state.eventName](...state.data);
    }
    /**
     * returns cross-environment response
     */
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
//mp.events.call('toggleInterface', 'Auth', true)
//mp.events.call('toggleInterface', 'Chat', true)

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
let renderEvent = null;
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
const startCamMoving = (path) => {
    rpc.callServer('client:startNewCamera', [path.persCoord]);
    currentPath = path;
    startTime = Date.now();
    // Удаляем предыдущий рендер-ивент если был
    if (renderEvent) {
        mp.events.remove(renderEvent);
    }
    createCamera(path.from, path.to);
    renderEvent = 'render';
    mp.events.add(renderEvent, () => {
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
    if (renderEvent) {
        mp.events.remove(renderEvent);
        renderEvent = null;
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
let isCameraSpan = false;
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
    if (!isCameraSpan)
        return;
    // 1. Затемнение перед сменной камеры (кроме первого запуска)
    if (currentCameraIndex !== -1) {
        mp.game.cam.doScreenFadeOut(1500);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // 2. Смена камеры (во время чёрного экрана)
    currentCameraIndex = getRandomCameraIndex();
    const path = coordsCamera[currentCameraIndex];
    startCamMoving(path); // <-- Камера меняется НЕВИДИМО для игрока
    // 3. Плавное появление
    mp.game.cam.doScreenFadeIn(1000);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 4. Ждём оставшееся время (duration - fadeTime)
    const visibleDuration = path.duration - 3000; // Вычитаем 2 секунды fade
    if (visibleDuration > 0) {
        await new Promise(resolve => setTimeout(resolve, visibleDuration));
    }
    // 5. Следующий цикл
    startNextCameraMovement();
};
const enableAuth = () => {
    isCameraSpan = true;
    rpc.call('execute', [`window.App.authReducer.showAuth()`]);
    rpc.callServer('client:authPlayerVisible', [false]);
    mp.game.ui.displayRadar(false);
    mp.players.local.freezePosition(true);
    setTimeout(() => {
        mp.gui.cursor.show(true, true);
    }, 500);
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
    rpc.register('client:auth:saveLogin', (login) => {
        mp.storage.data.authLogin = login;
    });
};
const disableAuth = () => {
    isCameraSpan = false;
    setTimeout(() => {
        mp.gui.cursor.show(false, false);
    }, 500);
    stopCamMoving();
    showLoading(3000);
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
    await setTimeout(() => {
        rpc.call('cef:authEnabled', []);
        setTimeout(() => {
            rpc.call('execute', [`window.App.welcomeReducer.hideWelcome()`]);
        }, 200);
    }, 7100);
});

rpc.browser = mp.browsers.new('package://cef/index.html');
mp.events.add('guiReady', () => {
    mp.gui.chat.show(false);
    mp.console.logInfo('guiReady');
    rpc.register('execute', (commands) => {
        // Преобразуем одиночную команду в массив
        const commandsArray = Array.isArray(commands) ? commands : [commands];
        // Логируем
        mp.console.logWarning(`Принято команд: ${commandsArray.length}`);
        // Передаем в CEF как массив
        rpc.callBrowser('client:executeCode', commandsArray);
    });
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
    player.hasVariable;
    await rpc.callServer('client:getFormatedDateTime', [true, true, true]);
    rpc.callServer('playerKnockout');
    rpc.call('execute', [`window.App.deathReducer.showDeath('Juice', null)`]);
    rpc.callBrowser('client:chanceReborn', [chance, luck]);
    mp.console.logWarning(`LUCK: ${luck}`);
    const playerPos = mp.players.local.position;
    const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false);
    rpc.callServer('client:playerDeath', [[player.position.x, player.position.y, getGroundZ]]);
});
rpc.register('server:getFormatedDateTime', (time) => {
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
