import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    lng: localStorage.getItem('language') || 'en', // Get saved language or default to English
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
