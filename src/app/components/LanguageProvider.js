'use client';
import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';

export default function LanguageProvider({ children, initialLang = 'fr' }) {
  const [language, setLanguage] = useState(initialLang);

  useEffect(() => {
    // Detect and set language
    const detectedLang = i18n.language || initialLang;

    if (detectedLang !== language) {
      i18n.changeLanguage(detectedLang);
      setLanguage(detectedLang);
    }
  }, [language, initialLang]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}