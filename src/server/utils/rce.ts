import { CustomEventBase } from "../../shared/CustomEventBase";
import { NoSQLbase } from './nosql'
import { performance } from 'perf_hooks'

type clientEventHandle = (player: PlayerMp, ...args: any[]) => void

interface IPerfomanceResult {
    eventName: string
    count: number
    averageExecutionTime: number
}

const PERFOMANCE_MIN_TIME = 20
export const eventsPerfomanceTestResults = new NoSQLbase<IPerfomanceResult>('perfomanceTest')

export class rce extends CustomEventBase {
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
})