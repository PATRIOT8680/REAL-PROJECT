import { CustomEventBase, CustomEventHandler } from "../../../shared/CustomEventBase.ts";

declare var CryptoJS: any;  // библиотека crypto-js д.б. подключена в index.html

// Глобальная переменная для сессионного секрета
let sessionSecret: string | null = null;
(window as any).setSessionSecret = (secret: string) => {
  sessionSecret = secret;
};

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export class rce extends CustomEventBase {
  static triggerCef(eventName: string, args: string) {
    try {
      this.registerHandles.forEach(([name, handle]) => {
        if (name === eventName) {
          handle(...JSON.parse(args));
        }
      });
    } catch (e) {
      console.log('error in triggerCef event: ' + e);
      console.log('event name ' + eventName);
      console.log('args ' + args);
    }
  }

  static callServerResponse = 0;
  static callClientResponse = 0;
  static requestServerHandle = new Map<number, (value?: any) => any>();
  static requestClientHandle = new Map<number, (value?: any) => any>();

  static triggerClient(name: string, ...args: any[]) {
    mp.trigger('triggerFromCef', name, ...args)
  }

  static lastServerSend = 0;

  // triggerServer — теперь с подписью
  static triggerServer(eventName: string, ...args: any[]) {
    if (sessionSecret) {
      const ts = Date.now();
      const nonce = generateNonce();
      const message = `${eventName}:${ts}:${nonce}:${JSON.stringify(args)}`;
      const secretWA = CryptoJS.enc.Base64.parse(sessionSecret);
      const hmac = CryptoJS.HmacSHA256(message, secretWA).toString(CryptoJS.enc.Hex);
      const payload = {
        __secure: true,
        __ts: ts,
        __nonce: nonce,
        __hmac: hmac,
        __args: args
      };
      // Отправляем имя события открытым текстом (сервер сам зашифрует при необходимости? Нет, нужно шифровать, но сервер ожидает уже зашифрованное имя в trigger:server)
      // В текущей архитектуре CEF -> клиент -> сервер идёт через mp.trigger('trigger:server', name, ...).
      // На сервере 'trigger:server' обрабатывается и вызывает rce.triggerCef/triggerClient? Нужно посмотреть.
      // У нас в клиентском коде есть mp.events.add('trigger:server', ...) который делает mp.events.callRemote('trigger:cef', rce.encryptEventName(name), args).
      // Значит CEF передаёт незашифрованное имя, клиент его шифрует и отправляет на сервер.
      // Поэтому здесь мы отправляем payload в 'trigger:server' с незашифрованным eventName — клиент сам зашифрует.
      mp.trigger("trigger:server", eventName, JSON.stringify(payload));
    } else {
      // Обычный вызов без подписи
      mp.trigger("trigger:server", eventName, JSON.stringify(args));
    }
  }

  // callServer — с подписью
  static callServer(eventName: string, ...args: any[]): Promise<any> {
    const requestID = this.callServerResponse++;
    return new Promise((resolve, reject) => {
      this.requestServerHandle.set(requestID, resolve);
      if (sessionSecret) {
        const ts = Date.now();
        const nonce = generateNonce();
        const message = `${eventName}:${ts}:${nonce}:${JSON.stringify(args)}`;
        const secretWA = CryptoJS.enc.Base64.parse(sessionSecret);
        const hmac = CryptoJS.HmacSHA256(message, secretWA).toString(CryptoJS.enc.Hex);
        const payload = {
          __secure: true,
          __ts: ts,
          __nonce: nonce,
          __hmac: hmac,
          __args: args
        };
        mp.trigger('call:server', requestID, eventName, JSON.stringify(payload));
      } else {
        mp.trigger('call:server', requestID, eventName, JSON.stringify(args));
      }
    });
  }

  static callClient(eventName: string, ...args: any[]): Promise<any> {
    const requestID = this.callClientResponse++;
    return new Promise((resolve, reject) => {
      this.requestClientHandle.set(requestID, resolve);
      mp.trigger('call:clientfromcef', requestID, eventName, ...args);
    });
  }

  static callServerResponseHandle(requestID: number, val: string) {
    const resolver = this.requestServerHandle.get(requestID);
    if (resolver) {
      resolver(JSON.parse(val))
      this.requestServerHandle.delete(requestID)
    } else {
      console.warn(`No resolver found for requestID: ${requestID}`)
    }
  }

  static callClientResponseHandle(requestID: number, val: any) {
    const resolver = this.requestClientHandle.get(requestID)
    if (resolver) {
      resolver(val)
      this.requestClientHandle.delete(requestID)
    } else {
      console.warn(`[CEF] No resolver for requestID: ${requestID}`)
    }
  }

  static registerCallable(eventName: string, handle: (...args: any[]) => any): CustomEventHandler {
    return super.register(eventName, async (callId: number, ...args: any[]) => {
      const result = await handle(...args)
      mp.trigger('__cefResponse', callId, JSON.stringify(result))
    })
  }
}

// @ts-ignore
window.customevent = rce