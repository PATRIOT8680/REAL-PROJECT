import { CustomEventBase } from "../../shared/CustomEventBase";
import { NoSQLbase } from './nosql'
import { performance } from 'perf_hooks'
<<<<<<< HEAD
import * as crypto from 'crypto'
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

type clientEventHandle = (player: PlayerMp, ...args: any[]) => void

interface IPerfomanceResult {
<<<<<<< HEAD
  eventName: string
  count: number
  averageExecutionTime: number
=======
    eventName: string
    count: number
    averageExecutionTime: number
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
}

const PERFOMANCE_MIN_TIME = 20
export const eventsPerfomanceTestResults = new NoSQLbase<IPerfomanceResult>('perfomanceTest')

export class rce extends CustomEventBase {
<<<<<<< HEAD
  static clientPoolLog = new Map<string, {count: number, last: number}>()
  static clientEvents = new Map<string, Set<clientEventHandle>>();
  static clientCallHandle = new Map<number, [(value?: any) => void, (reason?: any) => void]> ()
  static clientCallId = 0;

  static key: number = rce.getRandomKey()
  static getRandomKey(): number {
    return Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
  }
  static decryptEventName(eventName: string): string {
    return eventName
      .split('g')
      .filter(Boolean)
      .map(s => String.fromCharCode(parseInt(s,16) ^ rce.key) )
      .join('')
  }
  static encryptEventName(eventName: string): string {
    return eventName
      .split('')
      .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
      .join('g')
  }

  // ============= Новые поля для HMAC-защиты ============
  static sessionSecrets = new Map<number, Buffer>();   // player.id → secret
  static usedNonces = new Map<number, Set<string>>();   // player.id → Set(nonce)
  static nonceTTL = 30_000; // 30 секунд

  // Вызывается после успешной авторизации игрока
  static setupSessionSecret(player: PlayerMp): Buffer {
    const secret = crypto.randomBytes(32);
    this.sessionSecrets.set(player.id, secret);
    this.usedNonces.set(player.id, new Set());
    // Отправляем клиенту (игра + CEF через execute)
    player.call('setSessionSecret', [secret.toString('base64')]);
    // Отправим в CEF сразу (через клиентский скрипт, см. клиентскую часть)
    return secret;
  }

  static destroySession(player: PlayerMp) {
    this.sessionSecrets.delete(player.id);
    this.usedNonces.delete(player.id);
  }

  // Проверка HMAC
  static verifySecurePayload(
    player: PlayerMp,
    encryptedEventName: string,
    ts: number,
    nonce: string,
    hmac: string,
    argsJson: string
  ): boolean {
    const secret = this.sessionSecrets.get(player.id);
    if (!secret) return false;

    const now = Date.now();
    if (Math.abs(now - ts) > this.nonceTTL) {
      console.warn(`[SECURE] Timestamp expired for ${player.id}`);
      return false;
    }

    const nonces = this.usedNonces.get(player.id);
    if (nonces.has(nonce)) {
      console.warn(`[SECURE] Replay nonce from ${player.id}`);
      return false;
    }
    nonces.add(nonce);
    setTimeout(() => nonces.delete(nonce), this.nonceTTL * 2);

    const message = `${encryptedEventName}:${ts}:${nonce}:${argsJson}`;
    const expected = crypto.createHmac('sha256', secret).update(message).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expected, 'hex'));
  }

  // ============= Регистрация событий (без изменений) ==========
  static registerClientCef(name: string, handle: clientEventHandle){
    this.registerClient(name, handle);
    this.registerCef(name, handle);
  }

  static registerClient(name: string, handle: clientEventHandle){
    const encryptedName = this.encryptEventName(name);
    if (!this.clientEvents.has(encryptedName)) {
      this.clientEvents.set(encryptedName, new Set());
    }
    this.clientEvents.get(encryptedName)!.add(handle);
  }

  static unregisterClient(name: string, handle: clientEventHandle) {
    const encryptedName = this.encryptEventName(name);
    const handlers = this.clientEvents.get(encryptedName);
    if (handlers) {
      handlers.delete(handle);
    }
  }

  static cefEvents = new Map<string, Set<clientEventHandle>>();

  static registerCef(name: string, handle: clientEventHandle){
    const encryptedName = this.encryptEventName(name);
    if (!this.cefEvents.has(encryptedName)) {
      this.cefEvents.set(encryptedName, new Set());
    }
    this.cefEvents.get(encryptedName)!.add(handle);
  }

  static unregisterCef(name: string, handle: clientEventHandle) {
    const encryptedName = this.encryptEventName(name);
    const handlers = this.cefEvents.get(encryptedName);
    if (handlers) {
      handlers.delete(handle);
    }
  }

  static registerClientAndCef(name: string, handle: clientEventHandle){
    this.registerClient(name, handle);
    this.registerCef(name, handle);
  }

  // ========= Отправка клиенту / CEF (без изменений) ===========
  static triggerCef(player: PlayerMp, eventName: string, ...args:any[]){
    if(!mp.players.exists(player)) return;
    player.call('cef:trigger:event', [eventName, JSON.stringify(args)])
  }

  static triggerCefAll(eventName: string, ...args:any[]){
    mp.players.call('cef:trigger:event', [eventName, JSON.stringify(args)])
  }

  static triggerClient(player:PlayerMp, eventName: string, ...args:any[]){
    if(!mp.players.exists(player)) return;
    return this.triggerCl(player, eventName, ...args)
  }

  static triggerClients(eventName: string, ...args:any[]){
    return this.triggerCl(mp.players, eventName, ...args)
  }

  private static triggerCl(pl: PlayerMp | PlayerMpPool, eventName: string, ...args: any[]){
    const argsString = JSON.stringify(args)
    if (argsString.length >= 32700){
      const ids = Math.floor(Math.random() * (999999 - 111111)) + 111111
      let arr:string[] = [];
      for (let i = 0; i < argsString.length; i += 32500) arr.push(argsString.slice(i, i + 32500));
      arr.map((itm, index) => {
        pl.call('client:trigger:event:split', [ids, index, index == (arr.length - 1), eventName, itm])
      })
    } else {
      pl.call('client:trigger:event', [eventName, argsString])
    }
  }

  static callClient(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
    return new Promise((resolve, reject) => {
      if(!mp.players.exists(player)) return;
      const reqId = parseInt(`${this.clientCallId++}`)
      this.clientCallHandle.set(reqId, [resolve, reject]);
      player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])
    })
  }

  static callCef(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
    return new Promise((resolve, reject) => {
      if(!mp.players.exists(player)) return;
      const reqId = parseInt(`${this.clientCallId++}`)
      this.clientCallHandle.set(reqId, [resolve, reject]);
      player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])
    })
  }
}

// =================== Обработчики входящих вызовов ===================
mp.events.add('client:call:event:result', (player: PlayerMp, reqId: number, result: any) => {
  let res = rce.clientCallHandle.get(reqId);
  if(res) res[0](result);
  rce.clientCallHandle.delete(reqId);
})

// Универсальный исполнитель handlers
function executeHandlers(player: PlayerMp, name: string, argsArray: any[]) {
  const handlers = rce.clientEvents.get(name);
  if (!handlers) return;
  handlers.forEach(handler => {
    const t1 = performance.now()
    handler(player, ...argsArray);
    const t2 = performance.now();
    const time = t2 - t1
    if (time > PERFOMANCE_MIN_TIME) {
      console.debug(`Client event '${rce.decryptEventName(name)}' executed in ${time} ms}.`)
      const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
      if (!existedResult) eventsPerfomanceTestResults.insert({
        count: 1,
        averageExecutionTime: time,
        eventName: name
      })
      else {
        existedResult.count++
        existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
      }
    }
  });
}

// ============ trigger:client с авто-проверкой HMAC ============
mp.events.add('trigger:client', (player: PlayerMp, encryptedName: string, argss: string) => {
  const nowTm = Date.now() / 1000 | 0;
  // rate limit
  if(rce.clientPoolLog.has(`${player.id}_____${encryptedName}`)){
    const old = rce.clientPoolLog.get(`${player.id}_____${encryptedName}`);
    if(old.last + 2 > nowTm){
      old.count++;
      if(old.count === 10) { /* можно kick */ }
      rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, old)
    } else {
      rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, {count: 1, last: nowTm})
    }
  } else {
    rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, {count: 1, last: nowTm})
  }

  // Проверяем, есть ли сессия у игрока
  if (rce.sessionSecrets.has(player.id)) {
    try {
      const payload = JSON.parse(argss);
      // Ожидаемая структура secure-вызова: __secure, __ts, __nonce, __hmac, __args
      if (!payload || !payload.__secure) {
        console.warn(`[SECURE] Missing secure payload from ${player.id}`);
        return;
      }
      const valid = rce.verifySecurePayload(
        player,
        encryptedName,
        payload.__ts,
        payload.__nonce,
        payload.__hmac,
        JSON.stringify(payload.__args) // исходные args как строка
      );
      if (!valid) {
        console.warn(`[SECURE] Invalid HMAC from ${player.id}`);
        return;
      }
      // Вызываем обработчики только с __args
      executeHandlers(player, encryptedName, payload.__args);
      return;
    } catch (e) {
      console.error('Secure parse error', e);
      return;
    }
  }

  // Если сессии нет (до авторизации) — обычный вызов
  executeHandlers(player, encryptedName, JSON.parse(argss));
});

// ============ call:client с авто-проверкой HMAC ============
mp.events.add('call:client', (player: PlayerMp, requestID: number, encryptedName: string, argss: string) => {
  const nowTm = Date.now() / 1000 | 0;
  if(rce.clientPoolLog.has(`${player.id}_____${encryptedName}`)){
    const old = rce.clientPoolLog.get(`${player.id}_____${encryptedName}`);
    if(old.last + 2 > nowTm){
      old.count++;
      if(old.count === 10) {}
      rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, old)
    } else {
      rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, {count: 1, last: nowTm})
    }
  } else {
    rce.clientPoolLog.set(`${player.id}_____${encryptedName}`, {count: 1, last: nowTm})
  }

  const processCall = async (argsArray: any[]) => {
    const handlers = rce.clientEvents.get(encryptedName);
    if (handlers) {
      for (let handler of handlers) {
        if (!mp.players.exists(player)) return;
        let res: any;
        try {
          res = await handler(player, ...argsArray);
        } catch (error) {
          console.error(error);
        }
        if (!mp.players.exists(player)) return;
        player.call('call:client:response', [requestID, res]);
      }
    }
  };

  if (rce.sessionSecrets.has(player.id)) {
    try {
      const payload = JSON.parse(argss);
      if (!payload || !payload.__secure) {
        console.warn(`[SECURE] Missing secure payload in call from ${player.id}`);
        return;
      }
      const valid = rce.verifySecurePayload(
        player,
        encryptedName,
        payload.__ts,
        payload.__nonce,
        payload.__hmac,
        JSON.stringify(payload.__args)
      );
      if (!valid) {
        console.warn(`[SECURE] Invalid HMAC in call from ${player.id}`);
        return;
      }
      processCall(payload.__args);
    } catch (e) {
      console.error('Secure call parse error', e);
    }
  } else {
    processCall(JSON.parse(argss));
  }
});

// Остальные обработчики (CEF, call:cef, playerJoin/Quit) без изменений...
mp.events.add('trigger:cef', (player: PlayerMp, name: string, args: string) => {
  const nowTm = Date.now() / 1000 | 0;
  if(rce.clientPoolLog.has(`${player.id}_CEF____${name}`)){
    const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
    if(old.last + 2 > nowTm){
      old.count++;
      if(old.count === 10) {}
      rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
    } else {
      rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }
  } else {
    rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
  }

  const handlers = rce.cefEvents.get(name);
  if (handlers) {
    handlers.forEach(handler => {
      const t1 = performance.now();
      handler(player, ...(JSON.parse(args)));
      const t2 = performance.now();
      const time = t2 -t1
      if (time > PERFOMANCE_MIN_TIME) {
        console.debug(`CEF event '${rce.decryptEventName(name)}' executed in ${time} ms}.`)
        const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
        if (!existedResult) eventsPerfomanceTestResults.insert({
          count: 1,
          averageExecutionTime: time,
          eventName: name
        })
        else {
          existedResult.count++
          existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
        }
      }
    });
  }
})

mp.events.add('call:cef', (player: PlayerMp, requestID: number, name: string, ...args: any[]) => {
  const nowTm = Date.now() / 1000 | 0;
  if(rce.clientPoolLog.has(`${player.id}_CEF____${name}`)){
    const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
    if(old.last + 2 > nowTm){
      old.count++;
      if(old.count === 10) {}
      rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
    } else {
      rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }
  } else {
    rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
  }

  const handlers = rce.cefEvents.get(name);
  if (handlers) {
    handlers.forEach(async handler => {
      if (!mp.players.exists(player)) return;
      let res:void;
      try {
        res = await handler(player, ...args);
      } catch (error) {
        console.error(error);
      }
      if (!mp.players.exists(player)) return;
      player.call('call:cef:response', [requestID, res]);
    });
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  player.call('setKey', [rce.key])
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  rce.destroySession(player);
=======
    static clientPoolLog = new Map<string, {count: number, last: number}>()
    static clientEvents = new Map<string, Set<clientEventHandle>>();
    static clientCallHandle = new Map<number, [(value?: any) => void, (reason?: any) => void]> ()
    static clientCallId = 0;

    static key: number = rce.getRandomKey()
    static getRandomKey(): number {
        return Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
    }
    static decryptEventName(eventName: string): string {
        return eventName
            .split('g')
            .filter(Boolean)
            .map(s => String.fromCharCode(parseInt(s,16) ^ rce.key) )
            .join('')
    }
    static encryptEventName(eventName: string): string {
        return eventName
            .split('')
            .map(s => (s.charCodeAt(0) ^ rce.key).toString(16))
            .join('g')
    }

    static registerClientCef(name: string, handle: clientEventHandle){
        this.registerClient(name, handle);
        this.registerCef(name, handle);
    }

    static registerClient(name: string, handle: clientEventHandle){
        const encryptedName = this.encryptEventName(name);
        if (!this.clientEvents.has(encryptedName)) {
            this.clientEvents.set(encryptedName, new Set());
        }
        this.clientEvents.get(encryptedName)!.add(handle);
    }

    static unregisterClient(name: string, handle: clientEventHandle) {
        const encryptedName = this.encryptEventName(name);
        const handlers = this.clientEvents.get(encryptedName);
        if (handlers) {
            handlers.delete(handle);
        }
    }

    static cefEvents = new Map<string, Set<clientEventHandle>>();

    static registerCef(name: string, handle: clientEventHandle){
        const encryptedName = this.encryptEventName(name);
        if (!this.cefEvents.has(encryptedName)) {
            this.cefEvents.set(encryptedName, new Set());
        }
        this.cefEvents.get(encryptedName)!.add(handle);
    }

    static unregisterCef(name: string, handle: clientEventHandle) {
        const encryptedName = this.encryptEventName(name);
        const handlers = this.cefEvents.get(encryptedName);
        if (handlers) {
            handlers.delete(handle);
        }
    }

    static registerClientAndCef(name: string, handle: clientEventHandle){
        this.registerClient(name, handle);
        this.registerCef(name, handle);
    }

    static triggerCef(player: PlayerMp, eventName: string, ...args:any[]){
        if(!mp.players.exists(player)) return;
        player.call('cef:trigger:event', [eventName, JSON.stringify(args)])
    }

    static triggerCefAll(eventName: string, ...args:any[]){
        mp.players.call('cef:trigger:event', [eventName, JSON.stringify(args)])
    }

    static triggerClient(player:PlayerMp, eventName: string, ...args:any[]){
        if(!mp.players.exists(player)) return;
        return this.triggerCl(player, eventName, ...args)
    }

    static triggerClients(eventName: string, ...args:any[]){
        return this.triggerCl(mp.players, eventName, ...args)
    }

    private static triggerCl(pl: PlayerMp | PlayerMpPool, eventName: string, ...args: any[]){
        const argsString = JSON.stringify(args)
        if (argsString.length >= 32700){
            const ids = Math.floor(Math.random() * (999999 - 111111)) + 111111
            let arr:string[] = [];
            for (let i = 0; i < argsString.length; i += 32500) arr.push(argsString.slice(i, i + 32500));
            arr.map((itm, index) => {
                pl.call('client:trigger:event:split', [ids, index, index == (arr.length - 1), eventName, itm])
            })
        } else {
            pl.call('client:trigger:event', [eventName, argsString])
        }
    }

    static callClient(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
        return new Promise((resolve, reject) => {
            if(!mp.players.exists(player)) return;
            const reqId = parseInt(`${this.clientCallId++}`)
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])
        })
    }

    static callCef(player:PlayerMp, eventName: string, ...args:any[]): Promise<any>{
        return new Promise((resolve, reject) => {
            if(!mp.players.exists(player)) return;
            const reqId = parseInt(`${this.clientCallId++}`)
            this.clientCallHandle.set(reqId, [resolve, reject]);
            player.call('client:call:event', [eventName, reqId, JSON.stringify(args)])
        })
    }
}

mp.events.add('client:call:event:result', (player: PlayerMp, reqId: number, result: any) => {
    let res = rce.clientCallHandle.get(reqId);
    if(res) res[0](result);
    rce.clientCallHandle.delete(reqId);
})

mp.events.add('trigger:client', (player: PlayerMp, name: string, argss: string) => {
    const nowTm = Date.now() / 1000 | 0;
    if(rce.clientPoolLog.has(`${player.id}_____${name}`)){
        const old = rce.clientPoolLog.get(`${player.id}_____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam client event ${name}`)
            }
            rce.clientPoolLog.set(`${player.id}_____${name}`, old)
        } else {
            rce.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
        }
    } else {
        rce.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
    }

    const handlers = rce.clientEvents.get(name);
    if (handlers) {
        handlers.forEach(handler => {
            const t1 = performance.now()
            handler(player, ...(JSON.parse(argss)));
            const t2 = performance.now();
            const time = t2 -t1
            if (time > PERFOMANCE_MIN_TIME) {
                console.debug(`Client event '${rce.decryptEventName(name)}' executed in ${time} ms}.`)
                const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
                if (!existedResult) eventsPerfomanceTestResults.insert({
                    count: 1,
                    averageExecutionTime: time,
                    eventName: name
                })
                else {
                    existedResult.count++
                    existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
                }
            }
        });
    }
})

mp.events.add('call:client', (player: PlayerMp, requestID: number, name: string, argss: string) => {
    const nowTm = Date.now() / 1000 | 0;
    if(rce.clientPoolLog.has(`${player.id}_____${name}`)){
        const old = rce.clientPoolLog.get(`${player.id}_____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam client event ${name}`)
            }
            rce.clientPoolLog.set(`${player.id}_____${name}`, old)
        } else {
            rce.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
        }
    } else {
        rce.clientPoolLog.set(`${player.id}_____${name}`, {count: 1, last: nowTm})
    }

    const handlers = rce.clientEvents.get(name);
    if (handlers) {
        handlers.forEach(async handler => {
            if(!mp.players.exists(player)) return;
            let res: void;
            try {
                res = await handler(player, ...(JSON.parse(argss)));
            } catch (error) {
                console.error(error);
            }
            if(!mp.players.exists(player)) return;
            player.call('call:client:response', [requestID, res]);
        });
    }
})

mp.events.add('trigger:cef', (player: PlayerMp, name: string, args: string) => {
    const nowTm = Date.now() / 1000 | 0;

    if(rce.clientPoolLog.has(`${player.id}_CEF____${name}`)){
        const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam cef event ${name}`)
            }
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
        } else {
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
        }
    } else {
        rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }

    const handlers = rce.cefEvents.get(name);
    if (handlers) {
        handlers.forEach(handler => {
            const t1 = performance.now();
            handler(player, ...(JSON.parse(args)));
            const t2 = performance.now();
            const time = t2 -t1
            if (time > PERFOMANCE_MIN_TIME) {
                console.debug(`Client event '${rce.decryptEventName(name)}' executed in ${time} ms}.`)
                const existedResult = eventsPerfomanceTestResults.data.find(d => d.eventName == name)
                if (!existedResult) eventsPerfomanceTestResults.insert({
                    count: 1,
                    averageExecutionTime: time,
                    eventName: name
                })
                else {
                    existedResult.count++
                    existedResult.averageExecutionTime = (existedResult.averageExecutionTime + time) / existedResult.count
                }
            }
        });
    }
})

mp.events.add('call:cef', (player: PlayerMp, requestID: number, name: string, ...args: any[]) => {
    const nowTm = Date.now() / 1000 | 0;
    if(rce.clientPoolLog.has(`${player.id}_CEF____${name}`)){
        const old = rce.clientPoolLog.get(`${player.id}_CEF____${name}`);
        if(old.last + 2 > nowTm){
            old.count++;
            if(old.count === 10){
                // console.log(`WARNING!!!! ${player.user ? `AUTH ${player.user.name} ${player.dbid}` : `NON AUTH ${player.name} ${player.id}`} spam cef event ${name}`)
            }
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, old)
        } else {
            rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
        }
    } else {
        rce.clientPoolLog.set(`${player.id}_CEF____${name}`, {count: 1, last: nowTm})
    }

    const handlers = rce.cefEvents.get(name);
    if (handlers) {
        handlers.forEach(async handler => {
            if (!mp.players.exists(player)) return;
            let res:void;
            try {
                res = await handler(player, ...args);
            } catch (error) {
                console.error(error);
            }
            if (!mp.players.exists(player)) return;
            player.call('call:cef:response', [requestID, res]);
        });
    }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
    player.call('setKey', [rce.key])
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
})