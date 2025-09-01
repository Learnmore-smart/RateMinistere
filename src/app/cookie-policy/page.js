'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../AstrAlumnaGuidelines/AstrAlumnaGuidelines.module.css';
import Tooltip from '../components/Tooltip';
import { Undo2 } from 'lucide-react';

const CookiePolicy = () => {
  const { t } = useTranslation();

  const handleUndo = () => {
    window.history.back();
  }

  return (
    <div className={styles.container}>
      <Tooltip text="Go back">
        <button className={styles['undo-button']} onClick={handleUndo}>
          <Undo2 size={24} />
        </button>
      </Tooltip>
      <h1 className={styles.title}>{t('cookiePolicy.title')}</h1>
      <p className={styles.lastUpdated}>{t('cookiePolicy.lastUpdated')}</p>

      <div className={styles.section}>
        <p >
          {t('cookiePolicy.introduction.paragraph1')}{' '}
          <a href={t('privacyPolicy.introduction.links.0.url')}
            className={`${styles.address} ${styles.externalLinkIcon}`}
            target="_blank"
            rel="noopener noreferrer">
            {t('privacyPolicy.introduction.links.0.name')}
          </a>
          {' '}{t('cookiePolicy.introduction.paragraph1-1')}
        </p>
        <p>{t('cookiePolicy.introduction.paragraph2')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.whatAreCookies.title')}</h2>
        <p>{t('cookiePolicy.whatAreCookies.paragraph1')}</p>
        <p>{t('cookiePolicy.whatAreCookies.paragraph2')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.whyUseCookies.title')}</h2>
        <p>{t('cookiePolicy.whyUseCookies.paragraph')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.controlCookies.title')}</h2>
        <p>{t('cookiePolicy.controlCookies.paragraph1')}</p>
        <p>{t('cookiePolicy.controlCookies.paragraph2')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.browserControl.title')}</h2>
        <p>{t('cookiePolicy.browserControl.paragraph')}</p>
        <ul className={styles.recommendationsList}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <li key={index}>
              {t(`cookiePolicy.browserControl.browsers.${index}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subsubheading}>{t('cookiePolicy.browserControl.advertisingNetworks.title')}</h3>
        <ul className={styles.recommendationsList}>
          {[0, 1, 2].map((index) => (
            <li key={index}>
              <a href={t(`cookiePolicy.browserControl.advertisingNetworks.links.${index}.url`)}
                className={`${styles.address} ${styles.externalLinkIcon}`}
                target="_blank"
                rel="noopener noreferrer">
                {t(`cookiePolicy.browserControl.advertisingNetworks.links.${index}.name`)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.otherTrackingTechnologies.title')}</h2>
        {[1, 2, 3].map((num) => (
          <p key={num}>
            {t(`cookiePolicy.otherTrackingTechnologies.paragraph${num}`)}
          </p>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.flashCookies.title')}</h2>
        {[1, 2, 3].map((num) => (
          <p key={num}>
            {t(`cookiePolicy.flashCookies.paragraph${num}`)}
          </p>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.targetedAdvertising.title')}</h2>
        <p>{t('cookiePolicy.targetedAdvertising.paragraph')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('cookiePolicy.policyUpdates.title')}</h2>
        {[1, 2, 3].map((num) => (
          <p key={num}>
            {t(`cookiePolicy.policyUpdates.paragraph${num}`)}
          </p>
        ))}
      </div>

      <div className={styles.contactSection}>
        <h2 className={styles.contactHeading}>{t('cookiePolicy.contact.title')}</h2>
        <p>{t('cookiePolicy.contact.description')}</p>
        <address className={styles.address}>
          <div>{t('cookiePolicy.contact.address.company')}</div>
          <div>{t('cookiePolicy.contact.address.city')}</div>
          <div>{t('cookiePolicy.contact.address.country')}</div>
          <a href={`mailto:${t('cookiePolicy.contact.address.email')}`}
            className={`${styles.address} ${styles.emailLink}`}>
            {t('cookiePolicy.contact.address.email')}
          </a>
        </address>
      </div>
    </div>
  );
};

export default CookiePolicy;