import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { EventEmitter } from 'events'

import App from './App'
import { store } from './store/store'
import { Rpc } from '@entityseven/rage-fw-rpc'
import NotifyProvider from './components/Notify/NotifyProvider'

declare global {
  interface Window {
    mp: Mp;
  }
}

if (typeof window !== 'undefined' && typeof window.mp === 'undefined') {
  window.mp = {
    events: {
      add: (name: string, callback: (...args: any[]) => void) => {},
    },
    trigger: (name: string, ...args: any[]) => {},
    invoke: (name: string, ...args: any[]) => {},
  };
}

export const rpc = new Rpc({
    forceBrowserDevMode: false,
    debugLogs: true
})


rpc.register('client:executeCode', (code: string) => {
  rpc.callClient('clientCmd', [`На CEF мы приняли код с client: ${code}`])
  try {
    eval(code)
  } catch (e) {
    rpc.callClient('clientCmd', [`Ошибка при выполнении кода: ${e}`])
  }
})

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <NotifyProvider>
      <App />
    </NotifyProvider>
  </Provider>
)
