import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import App from './App'
import { store } from './store/store'
import { initI18n, i18n } from './locales/index'

import NotifyProvider from './components/Notify/NotifyProvider'
import { ModalProvider } from "./context/ModalContext.tsx";
import ModalComponent from "./components/Modal/Index.tsx";

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

const encdd = 'aHR0cDovL2Nkbi5kZXYtcmVhbC1ycC5ydQ'

export const CDN_URL = atob(encdd)

initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ModalProvider>
          <NotifyProvider>
            <App />
            <ModalComponent />
          </NotifyProvider>
        </ModalProvider>
      </I18nextProvider>
    </Provider>
  );
});
