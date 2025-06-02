import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from './en.json';
import FR from './fr.json';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: 'FR',
    resources: {
      EN: {
        translation: EN
      },
      FR: {
        translation: FR
      }
    }
  });

export default i18n;
