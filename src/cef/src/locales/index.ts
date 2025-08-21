import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const languages = ['ru', 'en', 'fr', 'es', 'de'];
const namespaces = ['auth', 'loading', 'welcome'];

const loadTranslation = (lang: string, ns: string): Promise<any> => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `./assets/translations/${lang}/${ns}.json`, true);
    xhr.onload = () => {
      try {
        resolve(xhr.status === 200 ? JSON.parse(xhr.responseText) : {});
      } catch {
        resolve({});
      }
    };
    xhr.onerror = () => resolve({});
    xhr.send();
  });
};

export const initI18n = () => {
  const resources: Record<string, any> = {};

  const promises = languages.map(async (lang) => {
    resources[lang] = {};
    for (const ns of namespaces) {
      resources[lang][ns] = await loadTranslation(lang, ns);
    }
  });

  return Promise.all(promises).then(() => {
    return i18next.use(initReactI18next).init({
      resources,
      lng: 'ru',
      fallbackLng: 'en',
      ns: namespaces,
      defaultNS: 'loading',
      interpolation: {
        escapeValue: false
      }
    });
  });
};

export const i18n = i18next;