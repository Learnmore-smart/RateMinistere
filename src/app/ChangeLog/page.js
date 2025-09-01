// Changelog.jsx
'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChangeLog.module.css';

function Changelog() {
  const { t } = useTranslation();

  const changeLogData = t('changelog', { returnObjects: true });

  // Reverse the array to display the latest version first
  const reversedChangeLogData = [...changeLogData].reverse();

  return (
    <div className={styles.changelogContainer}>
      <h1 className={styles.changelogTitle}>{t('changeLogTitle')}</h1>
      {reversedChangeLogData.map((versionData) => (  // Use the reversed array
        <div key={versionData.version} className={styles.versionSection}>
          <h2 className={styles.versionHeader}>{versionData.version}</h2>
          <p className={styles.versionDate}>{versionData.date}</p>

          <div className={styles.whatSection}>
            <h3 className={styles.whatTitle}>{t('what')}</h3>
            <ul className={styles.whatList}>
              {versionData.newFeatures && versionData.newFeatures.map((feature, index) => (
                <li key={`feature-${index}`} className={styles.whatItem}>{feature}</li>
              ))}
              {versionData.improvements && versionData.improvements.map((improvement, index) => (
                <li key={`improvement-${index}`} className={styles.whatItem}>{improvement}</li>
              ))}
               {versionData.bugFixes && versionData.bugFixes.map((bugFix, index) => (
                <li key={`bugFix-${index}`} className={styles.whatItem}>{bugFix}</li>
              ))}
            </ul>
          </div>

          <div className={styles.whySection}>
            <h3 className={styles.whyTitle}>{t('why')}</h3>
            <p className={styles.whyDescription}>{versionData.why}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Changelog;