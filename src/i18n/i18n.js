'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from '../../public/locales/en-US.json';
import frFR from '../../public/locales/fr-FR.json';

const resources = {
  en: { translation: enUS },
  fr: { translation: frFR }
};

// Check if i18n is already initialized to prevent re-initialization
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'fr',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        caches: ['localStorage', 'cookie']
      }
    });
}

export default i18n;
