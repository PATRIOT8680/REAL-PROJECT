 /* // @ts-ignore
 const EventManager = window.EventManager || {
    events: {},
  
    addHandler: function (eventName: string, handler: any) { // eslint-disable-line
        this.events[eventName] = handler;
    },

    callHandler: function ( eventName: string, type: string, data: any ) { // eslint-disable-line
        if (eventName in this.events) {        
            this.events[eventName]({type: type, data: data})
        } else {
            console.log(eventName + 'not found');
        }
    },
  
    removeHandler: function (eventName: string) {
        if (eventName in this.events) {
            this.events[eventName] = null;
            delete this.events[eventName];
        }
    },

    trigger: function(eventTarget: string, eventName: string, ...args: any) { // eslint-disable-line
        if (process.env.NODE_ENV !== 'production') {
            console.log(`emitted: server::${eventTarget}:${eventName}\n`, ...args) 
        } else {
            // @ts-ignore
            mp.trigger(eventTarget, eventName, JSON.stringify(...args)) // eslint-disable-line
        }
    }
  };

export function trigger(eventName: string, args: any) {
    var handlers = EventManager.events[eventName];
    handlers.forEach((handler: (arg0: any) => any) => handler(JSON.parse(args)));
};


  // @ts-ignore
  
  window.EventManager = EventManager;
  export default EventManager; */

  
interface EventHandler {
    (args: any): void;
}

export interface EventManagerType {
    events: { [key: string]: EventHandler[] };
    addHandler(eventName: string, handler: EventHandler): void;
    removeHandler(eventName: string, handler: EventHandler): void;
}

export const EventManager: EventManagerType = {
    events: {},
    
    addHandler(eventName: string, handler: EventHandler): void {
        if (eventName in this.events) {
            this.events[eventName].push(handler);
        } else {
            this.events[eventName] = [handler];
        }
    },
        
    removeHandler(eventName: string, handler: EventHandler): void { 
        if (eventName in this.events) {
            const index = this.events[eventName].indexOf(handler);
            if (index !== -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    }
}

// Handle events from client
export function trigger(eventName: string, args: string): void {
    const handlers = EventManager.events[eventName];
    if (handlers) {
        handlers.forEach(handler => handler(JSON.parse(args)));
    }
}

(window as any).trigger = trigger;
(window as any).EventManager = EventManager;