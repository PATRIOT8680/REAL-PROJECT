import { CustomEventBase } from "../../shared/CustomEventBase";
import { gui } from "../menus/global";

type serverEventHandle = (...args: any[]) => void;
type universalEventHandle = (...args: any[]) => void;

mp.events.add('setKey', (key: number) => {
    rce.key = key;
});

export class rce extends CustomEventBase {
    static callServerResponse = 1;
    static requestServerHandle = new Map<number, (value?: any) => any>();
    static callServerResponseCEF = 1;
    static requestServerHandleCEF = new Map<number, (value?: any) => any>();
    static registerServerEvents = new Map<string, Set<serverEventHandle>>();
    static registerSocketEvents = new Map<string, Set<serverEventHandle>>();

    // Добавляем обработчики для событий из CEF
    static cefHandlers = new Map<string, Set<universalEventHandle>>();

    static key: number;

    static encryptEventName(eventName: string): string {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
            .join('g');
    }

    static triggerServer(eventName: string, ...args: any[]) {
        mp.events.callRemote('trigger:client', rce.encryptEventName(eventName), JSON.stringify(args));
    }

    static callServer(eventName: string, ...args: any[]): Promise<any> {
        const requestID = rce.callServerResponse++;
        return new Promise((resolve, reject) => {
            rce.requestServerHandle.set(requestID, resolve);
            mp.events.callRemote('call:client', requestID, rce.encryptEventName(eventName), JSON.stringify(args));
        });
    }

    static triggerCef(eventName: string, ...args: any[]) {
        mp.browsers.forEach((browser: any) => {
            if (browser.active) {
                mp.console.logWarning(`Мы отправляем на CEF: ${eventName}`)
                browser.execute(`window.customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`);
        }
        });
    }

    static forceTriggerCef(eventName: string, ...args: any[]) {
        mp.browsers.forEach(browser => {
            browser.execute(`window.customevent.triggerCef('${eventName}', '${JSON.stringify(args)}');`);
        });
    }

    static registerServer(eventName: string, handle: serverEventHandle) {
        if (!this.registerServerEvents.has(eventName)) {
            this.registerServerEvents.set(eventName, new Set());
        }
        this.registerServerEvents.get(eventName)!.add(handle);
    }

    static registerAll(name: string, handle: serverEventHandle) {
        this.registerServer(name, handle);
        CustomEventBase.register(name, handle);

        // Также регистрируем для обработки событий из CEF
        if (!this.cefHandlers.has(name)) {
            this.cefHandlers.set(name, new Set());
        }
        this.cefHandlers.get(name)!.add(handle);
    }

    // Метод для вызова событий из CEF
    static triggerFromCef(eventName: string, ...args: any[]) {
        const handlers = this.cefHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(...args);
                } catch (error) {
                    mp.console.logError(`Error in CEF event ${eventName}:`, error);
                }
            });
        }
    }
}

// Обработчик для событий из CEF
mp.events.add('triggerFromCef', (eventName: string, ...args: any[]) => {
    rce.triggerFromCef(eventName, ...args);
});

// Остальной код без изменений
mp.events.add("client:trigger:event", (eventname: string, argsstring: string) => triggerEvent(eventname, argsstring));

let enableEventsLogging = mp.storage.data.enableEventsLoggin;
const eventsCountMap = new Map<string, number>();

const triggerEvent = async (eventname: string, argsstring: string) => {
    if (!eventsCountMap.has(eventname)) {
        eventsCountMap.set(eventname, 0);
    }
    eventsCountMap.set(eventname, (eventsCountMap.get(eventname) + 1));

    const handlers = rce.registerServerEvents.get(eventname);

    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering started: ${eventname}`);
    }

    if (!handlers || handlers.size === 0) return mp.console.logError("[CustomEvent] trigger non exists event " + eventname, true);

    handlers.forEach(handler => {
        try {
            handler(...(JSON.parse(argsstring)));
        } catch (error) {
            if (enableEventsLogging) {
                mp.console.logError(`event (${eventname}) catch an error: ${error}`);
            }
        }
    });

    if (enableEventsLogging) {
        mp.console.logInfo(`event triggering ended: ${eventname}`);
    }
};

let splitTrigger = new Map<string, string[]>();

mp.events.add("client:trigger:event:split", async (tid: number, index: number, last: boolean, eventname: string, argsstring: string) => {
    const handlers = rce.registerServerEvents.get(eventname);
    if (!handlers || handlers.size === 0) return mp.console.logError("[CustomEvent] trigger split non exists event " + eventname, true);

    if (!splitTrigger.has(`${tid}_${eventname}`)) {
        splitTrigger.set(`${tid}_${eventname}`, []);
    }

    let d = splitTrigger.get(`${tid}_${eventname}`);
    d[index] = argsstring;
    if (last) {
        triggerEvent(eventname, d.join(''));
    } else {
        splitTrigger.set(`${tid}_${eventname}`, d);
    }
});

mp.events.add("client:call:event", async (eventname: string, requestID: number, argsstring: string) => {
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
    } catch (error) {
        mp.console.logError(error, true);
    }
});

mp.events.add('cef:trigger:event', (eventName: string, args: string) => {
    rce.triggerCef(eventName, ...JSON.parse(args));
});

mp.events.add('call:client:response', (requestID: number, res: any) => {
    let resolve = rce.requestServerHandle.get(requestID);
    if (!resolve) return;
    resolve(res);
});

mp.events.add('call:cef:response', (requestID: number, res: any) => {
    mp.browsers.forEach((browser: any) => {
        browser.execute(`window.customevent.callServerResponseHandle(${requestID}, '${JSON.stringify(res)}');`);
    });
});

mp.events.add('call:server', (requestID: number, eventName: string, ...args: any[]) => mp.events.callRemote('call:cef', requestID, rce.encryptEventName(eventName), ...args));

mp.events.add('call:clientfromcef', async (requestID: number, eventName: string, ...args: any[]) => {
    const fnd = await CustomEventBase.call(eventName, ...args);
    mp.browsers.forEach((browser: any) => {
        if (browser.eventReady) browser.execute(`window.customevent.callClientResponseHandle(${requestID}, '${JSON.stringify(fnd)}');`);
    });
});

mp.events.add('trigger:server', (name: string, args: string) => {
    mp.events.callRemote('trigger:cef', rce.encryptEventName(name), args)
});