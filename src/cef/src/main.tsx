import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import App from './App'
import { store } from './store/store'
import NotifyProvider from './components/Notify/NotifyProvider'
import { initI18n, i18n } from './locales/index'

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
