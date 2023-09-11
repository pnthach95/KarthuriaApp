import 'i18next';
import ns1 from 'locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ns1';
    resources: {ns1: typeof ns1};
  }
}
