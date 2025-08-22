import { CustomEventBase } from "../../../shared/CustomEventBase.ts";

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

  // Изменяем метод triggerClient для отправки через общий канал
  static triggerClient(name: string, ...args: any[]) {
    mp.trigger('triggerFromCef', name, ...args);
  }

  static lastServerSend = 0;

  static triggerServer(eventName: string, ...args: any[]) {
    mp.trigger("trigger:server", eventName, JSON.stringify(args));
  }

  static callServer(eventName: string, ...args: any[]): Promise<any> {
    const requestID = this.callServerResponse++;
    return new Promise((resolve, reject) => {
      this.requestServerHandle.set(requestID, resolve);
      mp.trigger('call:server', requestID, eventName, ...args);
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
      resolver(JSON.parse(val));
      this.requestServerHandle.delete(requestID);
    } else {
      console.warn(`No resolver found for requestID: ${requestID}`);
    }
  }

  static callClientResponseHandle(requestID: number, val: string) {
    const resolver = this.requestClientHandle.get(requestID);
    if (resolver) {
      resolver(JSON.parse(val));
      this.requestClientHandle.delete(requestID);
    } else {
      console.warn(`No resolver found for requestID: ${requestID}`);
    }
  }
}

// @ts-ignore
window.customevent = rce;