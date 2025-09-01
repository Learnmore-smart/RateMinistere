'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: persist language choice
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    // Only run on client-side
    const storedLanguage = localStorage.getItem('language');

    // Set initial language after mount
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }

    setMounted(true);
  }, []);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.languageSwitcherContainer}>
      <div className={styles.languageSwitcher}>
        <button
          onClick={() => changeLanguage('en')}
          className={`${styles.languageButton} ${styles.en} ${i18n.language === 'en' ? styles.activeLanguage : ''}`}
        >
          <p>English</p>
        </button>
        <button
          onClick={() => changeLanguage('fr')}
          className={`${styles.languageButton} ${styles.fr} ${i18n.language === 'fr' ? styles.activeLanguage : ''}`}
        >
          <p>Français</p>
        </button>
      </div>
    </div>
  );
}