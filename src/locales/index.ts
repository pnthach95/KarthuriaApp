import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

export const defaultNS = 'ns1';

export const resources = {
  en: {ns1: en},
  vi: {ns1: vi},
};

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  debug: __DEV__,
  defaultNS,
  ns: ['ns1'],
  resources,
  interpolation: {escapeValue: false},
});

export default i18n;
