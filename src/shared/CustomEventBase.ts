export interface CustomEventHandler {
  destroy: () => void;
}

export class CustomEventBase {
  static registerLocalIds = 1;
  static registerHandles = new Map<string, [string, (...args: any[]) => any]>();

  static clearRegister(eventName: string) {
    this.registerHandles.forEach((value, key) => {
      if (value[0] === eventName) this.registerHandles.delete(key);
    });
  }

  static clearRegisterAll() {
    this.registerHandles.clear();
  }

  static register(eventName: string, handle: (...args: any[]) => any): CustomEventHandler {
    // Очистка старых обработчиков для этого события
    this.clearRegister(eventName);

    const id = `${this.registerLocalIds++}`;
    this.registerHandles.set(id, [eventName, handle]);
    return { destroy: () => this.registerHandles.delete(id) };
  }

  static registerCallable(eventName: string, handle: (...args: any[]) => any): CustomEventHandler {
    return this.register(eventName, handle); // пока используем тот же механизм
  }

  static trigger(eventName: string, ...args: any[]) {
    this.registerHandles.forEach(([name, handle]) => {
      if (name === eventName) handle(...args);
    });
  }

  static async call(eventName: string, ...args: any[]) {
    for (const [name, handle] of this.registerHandles.values()) {
      if (name === eventName) return await handle(...args);
    }
    return null;
  }
}