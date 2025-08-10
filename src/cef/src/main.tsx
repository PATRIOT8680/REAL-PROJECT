import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next';
import { EventEmitter } from 'events'

import App from './App'
import { store } from './store/store'
import { Rpc } from '@entityseven/rage-fw-rpc'
import NotifyProvider from './components/Notify/NotifyProvider'
import { initI18n, i18n } from './locales/index';

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


//rpc.register('client:executeCode', (code: string) => {
//  rpc.callClient('clientCmd', [`На CEF мы приняли код с client: ${code}`])
//  try {
//    eval(code)
//  } catch (e) {
//    rpc.callClient('clientCmd', [`Ошибка при выполнении кода: ${e}`])
//  }
//})


  rpc.register('client:executeCode', (commands: string | string[]) => {
    // Нормализуем в массив
    const commandsArray = Array.isArray(commands) ? commands : [commands];
    
    commandsArray.forEach((code, index) => {
      try {
        console.log(`Выполняем команду #${index + 1}:`, code);
        
        // Безопасный аналог eval
        new Function(code)();
        
      } catch (e) {
        console.error(`Ошибка в команде #${index + 1}:`, e);
        rpc.callClient('clientCmd', [`Ошибка: ${e}`]);
      }
    });
  });

initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NotifyProvider>
          <App />
        </NotifyProvider>
      </I18nextProvider>
    </Provider>
  );
});
