import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  debug: __DEV__,
  resources: {en: {translation: en}, vi: {translation: vi}},
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
