import { CustomEventBase } from "../../shared/CustomEventBase";
import { gui } from "../menus/global";
import CryptoJS from 'crypto-js';

type serverEventHandle = (...args: any[]) => void;
type universalEventHandle = (...args: any[]) => void;

mp.events.add('setKey', (key: number) => {
  rce.key = key;
});

// ── HMAC-сессия ────────────────────────────────────────
let sessionSecret: string | null = null;

mp.events.add('setSessionSecret', (secretBase64: string) => {
  sessionSecret = secretBase64;
  // Прокидываем секрет в CEF
  mp.browsers.forEach(browser => {
    browser.execute(`window.setSessionSecret && window.setSessionSecret('${secretBase64}')`);
  });
});

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export class rce extends CustomEventBase {
  static callServerResponse = 1;
  static cefCallId = 1;
  static requestServerHandle = new Map<number, (value?: any) => any>();
  static callServerResponseCEF = 1;
  static requestServerHandleCEF = new Map<number, (value?: any) => any>();
  static registerServerEvents = new Map<string, Set<serverEventHandle>>();
  static registerSocketEvents = new Map<string, Set<serverEventHandle>>();
  static cefPromises = new Map<number, (value: any) => void>();
  static cefHandlers = new Map<string, Set<universalEventHandle>>();
  static key: number;

  static encryptEventName(eventName: string): string {
    return eventName
      .split('')
      .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
      .join('g');
  }

  // ── triggerServer c авто-подписью ────────────────────
  static triggerServer(eventName: string, ...args: any[]) {
    const encryptedName = rce.encryptEventName(eventName);
    if (sessionSecret) {
      const ts = Date.now();
      const nonce = generateNonce();
      const message = `${encryptedName}:${ts}:${nonce}:${JSON.stringify(args)}`;
      const secretWA = CryptoJS.enc.Base64.parse(sessionSecret)
      const hmac = CryptoJS.HmacSHA256(message, secretWA).toString(CryptoJS.enc.Hex);
      const payload = {
        __secure: true,
        __ts: ts,
        __nonce: nonce,
        __hmac: hmac,
        __args: args
      };
      mp.events.callRemote('trigger:client', encryptedName, JSON.stringify(payload));
    } else {
      mp.events.callRemote('trigger:client', encryptedName, JSON.stringify(args));
    }
  }

  // ── callServer с авто-подписью ────────────────────────
  static callServer(eventName: string, ...args: any[]): Promise<any> {
    const requestID = rce.callServerResponse++;
    return new Promise((resolve, reject) => {
      rce.requestServerHandle.set(requestID, resolve);
      const encryptedName = rce.encryptEventName(eventName);
      if (sessionSecret) {
        const ts = Date.now();
        const nonce = generateNonce();
        const message = `${encryptedName}:${ts}:${nonce}:${JSON.stringify(args)}`;
        const secretWA = CryptoJS.enc.Base64.parse(sessionSecret);
        const hmac = CryptoJS.HmacSHA256(message, secretWA).toString(CryptoJS.enc.Hex);
        const payload = {
          __secure: true,
          __ts: ts,
          __nonce: nonce,
          __hmac: hmac,
          __args: args
        };
        mp.events.callRemote('call:client', requestID, encryptedName, JSON.stringify(payload));
      } else {
        mp.events.callRemote('call:client', requestID, encryptedName, JSON.stringify(args));
      }
    });
  }

  // ── Остальные методы (без изменений) ─────────────────
  static async callCef(eventName: string, ...args: any[]): Promise<any> {
    const id = this.cefCallId++;
    mp.console.logWarning(`[CLIENT] Вызываем CEF ${eventName} с id=${id}`);
    return new Promise((resolve) => {
      this.cefPromises.set(id, resolve);
      this.triggerCef(eventName, id, ...args);
    });
  }

  static handleCefResponse(id: number, result: any) {
    const resolve = this.cefPromises.get(id);
    if (resolve) {
      resolve(result);
      this.cefPromises.delete(id);
    }
  }

  static triggerCef(eventName: string, ...args: any[]) {
    mp.browsers.forEach((browser: any) => {
      if (browser.active) {
        mp.console.logWarning(`Мы отправляем на CEF: ${eventName}`);
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
    if (!this.cefHandlers.has(name)) {
      this.cefHandlers.set(name, new Set());
    }
    this.cefHandlers.get(name)!.add(handle);
  }

  static triggerFromCef(eventName: string, ...args: any[]) {
    const handlers = this.cefHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          mp.console.logError(`Error in CEF event ${eventName}: ${error}; ${args}`);
        }
      });
    }
  }
}

// ── Статические обработчики клиента ────────────────────
mp.events.add('triggerFromCef', (eventName: string, ...args: any[]) => {
  rce.triggerFromCef(eventName, ...args);
});

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

mp.events.add('__cefResponse', (id: number, result: any) => {
  let parsedResult;
  try {
    parsedResult = JSON.parse(result);
  } catch (e) {
    parsedResult = ['error'];
  }
  rce.handleCefResponse(id, parsedResult);
});

mp.events.add("client:call:event", async (eventname: string, requestID: number, argsstring: string) => {
  try {
    const handlers = rce.registerServerEvents.get(eventname);
    if (!handlers || handlers.size === 0) {
      mp.events.callRemote('client:call:event:result', requestID, null);
      return;
    }
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

mp.events.add('call:server', (requestID: number, eventName: string, ...args: any[]) => {
  mp.events.callRemote('call:cef', requestID, rce.encryptEventName(eventName), ...args);
});

mp.events.add('trigger:server', (name: string, args: string) => {
  mp.events.callRemote('trigger:cef', rce.encryptEventName(name), args);
});

mp.events.add('call:clientfromcef', async (requestID: number, eventName: string, ...args: any[]) => {
  try {
    const result = await CustomEventBase.call(eventName, ...args);
    mp.browsers.forEach((browser: any) => {
      if (browser.active) {
        browser.execute(`window.customevent.callClientResponseHandle(${requestID}, ${JSON.stringify(result)})`);
      }
    });
  } catch (error) {
    mp.browsers.forEach((browser: any) => {
      if (browser.active) {
        browser.execute(`window.customevent.callClientResponseHandle(${requestID}, null)`);
      }
    });
  }
});