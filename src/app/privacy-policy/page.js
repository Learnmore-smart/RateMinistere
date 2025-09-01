'use client';
import React from 'react';
import styles from '../AstrAlumnaGuidelines/AstrAlumnaGuidelines.module.css';
import { useTranslation } from 'react-i18next';
import Tooltip from '../components/Tooltip';
import { Undo2 } from 'lucide-react';

const PrivacyPolicy = () => {
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
      <h1 className={styles.title}>{t('privacyPolicy.title')}</h1>
      <p className={styles.updateDate}>{t('privacyPolicy.lastUpdated')}</p>

      <div className={styles.section}>
        <p>{t('privacyPolicy.introduction.paragraph1')}</p>
        <ul className={styles.recommendationsList}>
          <li>
            <span>
              {t('privacyPolicy.introduction.listItem1')}{' '}
              <a href={t('privacyPolicy.introduction.links.0.url')}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.address} ${styles.externalLinkIcon}`}>
                {t('privacyPolicy.introduction.links.0.name')}
              </a>
              {' '}
              {t('privacyPolicy.introduction.listItem1.1')}
            </span>
          </li>
          <li>{t('privacyPolicy.introduction.listItem2')}</li>
          <li>{t('privacyPolicy.introduction.listItem3')}</li>
          <li>{t('privacyPolicy.introduction.listItem4')}</li>
        </ul>
      </div>

      <div className={styles.highlight}>
        <p>
          <span>
            {t('privacyPolicy.questionsConcerns')} {' '}
            <a href={`mailto:${t('cookiePolicy.contact.address.email')}`} className={styles.address}>
              {t('cookiePolicy.contact.address.email')}
            </a>
          </span>
          {' '}
          {t('privacyPolicy.questionsConcerns.1')}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('privacyPolicy.summary.title')}</h2>
        <p>{t('privacyPolicy.summary.description')}</p>
        <ul className={styles.recommendationsList}>
          <li><a href="#information-we-collect" className={styles.address}>{t('privacyPolicy.summary.keyPoint1')}</a></li>
          <li><a href="#sensitive-information" className={styles.address}>{t('privacyPolicy.summary.keyPoint2')}</a></li>
          <li><a href="#third-party-info" className={styles.address}>{t('privacyPolicy.summary.keyPoint3')}</a></li>
          <li><a href="#how-we-process" className={styles.address}>{t('privacyPolicy.summary.keyPoint4')}</a></li>
          <li><a href="#sharing-information" className={styles.address}>{t('privacyPolicy.summary.keyPoint5')}</a></li>
          <li><a href="#data-security" className={styles.address}>{t('privacyPolicy.summary.keyPoint6')}</a></li>
          <li><a href="#privacy-rights" className={styles.address}>{t('privacyPolicy.summary.keyPoint7')}</a></li>
          <li><a href="#review-update-delete" className={styles.address}>{t('privacyPolicy.summary.keyPoint8')}</a></li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('privacyPolicy.tableOfContents.title')}</h2>
        <ol className={styles.recommendationsList}>
          <li><a href="#information-we-collect" className={styles.address}>{t('privacyPolicy.tableOfContents.item1')}</a></li>
          <li><a href="#how-we-process" className={styles.address}>{t('privacyPolicy.tableOfContents.item2')}</a></li>
          <li><a href="#legal-bases" className={styles.address}>{t('privacyPolicy.tableOfContents.item3')}</a></li>
          <li><a href="#sharing-information" className={styles.address}>{t('privacyPolicy.tableOfContents.item4')}</a></li>
          <li><a href="#third-party-websites" className={styles.address}>{t('privacyPolicy.tableOfContents.item5')}</a></li>
          <li><a href="#cookies" className={styles.address}>{t('privacyPolicy.tableOfContents.item6')}</a></li>
          <li><a href="#ai-products" className={styles.address}>{t('privacyPolicy.tableOfContents.item7')}</a></li>
          <li><a href="#social-logins" className={styles.address}>{t('privacyPolicy.tableOfContents.item8')}</a></li>
          <li><a href="#data-retention" className={styles.address}>{t('privacyPolicy.tableOfContents.item9')}</a></li>
          <li><a href="#data-security" className={styles.address}>{t('privacyPolicy.tableOfContents.item10')}</a></li>
          <li><a href="#privacy-rights" className={styles.address}>{t('privacyPolicy.tableOfContents.item11')}</a></li>
          <li><a href="#do-not-track" className={styles.address}>{t('privacyPolicy.tableOfContents.item12')}</a></li>
          <li><a href="#updates" className={styles.address}>{t('privacyPolicy.tableOfContents.item13')}</a></li>
          <li><a href="#contact" className={styles.address}>{t('privacyPolicy.tableOfContents.item14')}</a></li>
          <li><a href="#review-update-delete" className={styles.address}>{t('privacyPolicy.tableOfContents.item15')}</a></li>
        </ol>
      </div>

      <div className={styles.section}>
        <h2 id="information-we-collect" className={styles.subheading}>{t('privacyPolicy.informationWeCollect.title')}</h2>
        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.personalInformation.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.personalInformation.short')}</p>
        <p>{t('privacyPolicy.informationWeCollect.personalInformation.details')}</p>

        <div className={styles.highlight}>
          <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.sensitiveInformation.title')}</h3>
          <ul className={styles.recommendationsList}>
            <li>{t('privacyPolicy.informationWeCollect.sensitiveInformation.item1')}</li>
          </ul>
        </div>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.paymentData.title')}</h3>
        <p>
          <span>{t('privacyPolicy.informationWeCollect.paymentData.details')}{' '}
            <a href={t('privacyPolicy.informationWeCollect.paymentData.links.0.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.paymentData.links.0.name')}
            </a>
            {' '}
            {t('privacyPolicy.informationWeCollect.paymentData.details-coma')}
            <a href={t('privacyPolicy.informationWeCollect.paymentData.links.1.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.paymentData.links.1.name')}
            </a>
            {' '}
            {t('privacyPolicy.informationWeCollect.paymentData.details-coma')}
            <a href={t('privacyPolicy.informationWeCollect.paymentData.links.2.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.paymentData.links.2.name')}
            </a>
            {' '}
            {t('privacyPolicy.informationWeCollect.paymentData.details-and')}
            <a href={t('privacyPolicy.informationWeCollect.paymentData.links.3.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.paymentData.links.3.name')}
            </a>
            {' '}
            {t('privacyPolicy.informationWeCollect.paymentData.details-end')}
          </span>
        </p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.socialMediaLoginData.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.socialMediaLoginData.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.applicationData.title')}</h3>
        <ul className={styles.recommendationsList}>
          <li>{t('privacyPolicy.informationWeCollect.applicationData.geolocation')}</li>
          <li>{t('privacyPolicy.informationWeCollect.applicationData.mobileDeviceAccess')}</li>
          <li>{t('privacyPolicy.informationWeCollect.applicationData.mobileDeviceData')}</li>
          <li>{t('privacyPolicy.informationWeCollect.applicationData.pushNotifications')}</li>
        </ul>
        <p>{t('privacyPolicy.informationWeCollect.applicationData.usage')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.automaticallyCollected.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.automaticallyCollected.short')}</p>
        <p>{t('privacyPolicy.informationWeCollect.automaticallyCollected.details')}</p>
        <p>{t('privacyPolicy.informationWeCollect.automaticallyCollected.cookies')}{' '}
          <span>
            <a href={t('privacyPolicy.informationWeCollect.automaticallyCollected.links.0.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.automaticallyCollected.links.0.name')}
            </a>
            {t('privacyPolicy.informationWeCollect.automaticallyCollected.cookies-end')}
          </span>
        </p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.logAndUsageData.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.logAndUsageData.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.deviceData.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.deviceData.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.locationData.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.locationData.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.googleAPI.title')}</h3>
        <p>
          <span>{t('privacyPolicy.informationWeCollect.googleAPI.details')}{' '}
            <a href={t('privacyPolicy.informationWeCollect.googleAPI.links.0.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.informationWeCollect.googleAPI.links.0.name')}
            </a>
            {' '}
            {t('privacyPolicy.informationWeCollect.googleAPI.details-1')}
          </span>
        </p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.informationWeCollect.informationFromOtherSources.title')}</h3>
        <p>{t('privacyPolicy.informationWeCollect.informationFromOtherSources.short')}</p>
        <p>{t('privacyPolicy.informationWeCollect.informationFromOtherSources.details')}</p>
        <p>{t('privacyPolicy.informationWeCollect.informationFromOtherSources.socialMediaDetails')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="how-we-process" className={styles.subheading}>{t('privacyPolicy.howWeProcess.title')}</h2>
        <p>{t('privacyPolicy.howWeProcess.short')}</p>
        <ul className={styles.recommendationsList}>
          <li>{t('privacyPolicy.howWeProcess.accountManagement')}</li>
          <li>{t('privacyPolicy.howWeProcess.serviceDelivery')}</li>
          <li>{t('privacyPolicy.howWeProcess.userSupport')}</li>
          <li>{t('privacyPolicy.howWeProcess.administrativeInfo')}</li>
          <li>{t('privacyPolicy.howWeProcess.orderManagement')}</li>
          <li>{t('privacyPolicy.howWeProcess.userCommunication')}</li>
          <li>{t('privacyPolicy.howWeProcess.feedback')}</li>
          <li>{t('privacyPolicy.howWeProcess.marketing')}</li>
          <li>
            {t('privacyPolicy.howWeProcess.targetedAdvertising')}{' '}
            <a href={t('privacyPolicy.howWeProcess.links.0.url')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.address} ${styles.externalLinkIcon}`}>
              {t('privacyPolicy.howWeProcess.links.0.name')}
            </a>
            {t('privacyPolicy.howWeProcess.targetedAdvertising-1')}
          </li>
          <li>{t('privacyPolicy.howWeProcess.testimonials')}</li>
          <li>{t('privacyPolicy.howWeProcess.security')}</li>
          <li>{t('privacyPolicy.howWeProcess.prizeDraws')}</li>
          <li>{t('privacyPolicy.howWeProcess.evaluation')}</li>
          <li>{t('privacyPolicy.howWeProcess.marketingEffectiveness')}</li>
          <li>{t('privacyPolicy.howWeProcess.legalObligations')}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 id="legal-bases" className={styles.subheading}>{t('privacyPolicy.legalBases.title')}</h2>
        <p>{t('privacyPolicy.legalBases.short')}</p>
        <p>{t('privacyPolicy.legalBases.permission')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="sharing-information" className={styles.subheading}>{t('privacyPolicy.sharingInformation.title')}</h2>
        <p>{t('privacyPolicy.sharingInformation.short')}</p>
        <p>{t('privacyPolicy.sharingInformation.thirdParties')}</p>
        <ul className={styles.recommendationsList}>
          <li>{t('privacyPolicy.sharingInformation.vendors')}</li>
          <li>{t('privacyPolicy.sharingInformation.aiProviders')}</li>
          <li>{t('privacyPolicy.sharingInformation.allowUsersToConnect')}</li>
          <li>{t('privacyPolicy.sharingInformation.cloudServices')}</li>
          <li>{t('privacyPolicy.sharingInformation.communication')}</li>
          <li>{t('privacyPolicy.sharingInformation.socialMedia')}</li>
          <li>{t('privacyPolicy.sharingInformation.userAccountRegistration')}</li>
          <li>{t('privacyPolicy.sharingInformation.analytics')}</li>
          <li>{t('privacyPolicy.sharingInformation.hosting')}</li>
        </ul>
        <div className={styles.highlight}>
          <ul>
            {t('privacyPolicy.sharingInformation.situations', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 id="third-party-websites" className={styles.subheading}>{t('privacyPolicy.thirdPartyWebsites.title')}</h2>
        <p>{t('privacyPolicy.thirdPartyWebsites.short')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="cookies" className={styles.subheading}>{t('privacyPolicy.cookies.title')}</h2>
        <p>{t('privacyPolicy.cookies.short')}</p>
        <p>{t('privacyPolicy.cookies.details')}</p>
        <p>{t('privacyPolicy.cookies.thirdPartyCookies')}</p>
        <p>
          {t('privacyPolicy.cookies.cookieNotice')}{' '}
          <a href={t('privacyPolicy.cookies.links.0.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.cookies.links.0.name')}
          </a>
          {t('privacyPolicy.cookies.cookieNotice-1')}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subsubheading}>{t('privacyPolicy.googleAnalytics.title')}</h3>
        <p>
          {t('privacyPolicy.googleAnalytics.details')}
          <a href={t('privacyPolicy.googleAnalytics.links.0.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.googleAnalytics.links.0.name')}
          </a>
          {t('privacyPolicy.googleAnalytics.details-1')}
          <a href={t('privacyPolicy.googleAnalytics.links.1.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.googleAnalytics.links.1.name')}
          </a>
          {t('privacyPolicy.googleAnalytics.details-2')}
          <a href={t('privacyPolicy.googleAnalytics.links.2.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.googleAnalytics.links.2.name')}
          </a>
          {t('privacyPolicy.googleAnalytics.details-3')}
          <a href={t('privacyPolicy.googleAnalytics.links.3.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.googleAnalytics.links.3.name')}
          </a>
          {t('privacyPolicy.googleAnalytics.details-4')}
        </p>
      </div>

      <div className={styles.section}>
        <h2 id="ai-products" className={styles.subheading}>{t('privacyPolicy.aiProducts.title')}</h2>
        <p>{t('privacyPolicy.aiProducts.short')}</p>
        <p>{t('privacyPolicy.aiProducts.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.aiProducts.useOfAITechnologies.title')}</h3>
        <p>{t('privacyPolicy.aiProducts.useOfAITechnologies.details')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.aiProducts.ourAIProducts.title')}</h3>
        <p>{t('privacyPolicy.aiProducts.ourAIProducts.details')}</p>
        <ul className={styles.recommendationsList}>
          {t('privacyPolicy.aiProducts.ourAIProducts.functions', { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.aiProducts.howWeProcessDataUsingAI.title')}</h3>
        <p>{t('privacyPolicy.aiProducts.howWeProcessDataUsingAI.details')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="social-logins" className={styles.subheading}>{t('privacyPolicy.socialLogins.title')}</h2>
        <p>{t('privacyPolicy.socialLogins.short')}</p>
        <p>{t('privacyPolicy.socialLogins.details')}</p>
        <p>{t('privacyPolicy.socialLogins.socialMediaProvider')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="data-retention" className={styles.subheading}>{t('privacyPolicy.dataRetention.title')}</h2>
        <p>{t('privacyPolicy.dataRetention.short')}</p>
        <p>{t('privacyPolicy.dataRetention.details')}</p>
        <p>{t('privacyPolicy.dataRetention.deletion')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="data-security" className={styles.subheading}>{t('privacyPolicy.dataSecurity.title')}</h2>
        <p>{t('privacyPolicy.dataSecurity.short')}</p>
        <p>{t('privacyPolicy.dataSecurity.details')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="privacy-rights" className={styles.subheading}>{t('privacyPolicy.privacyRights.title')}</h2>
        <p>{t('privacyPolicy.privacyRights.short')}</p>
        <p>{t('privacyPolicy.privacyRights.details')}</p>
        <p>{t('privacyPolicy.privacyRights.consideration')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.privacyRights.withdrawingConsent.title')}</h3>
        <p>{t('privacyPolicy.privacyRights.withdrawingConsent.details')}</p>
        <p>{t('privacyPolicy.privacyRights.withdrawingConsent.limitations')}</p>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.privacyRights.accountInformation.title')}</h3>
        <p>{t('privacyPolicy.privacyRights.accountInformation.details')}</p>
        <ul className={styles.recommendationsList}>
          {t('privacyPolicy.privacyRights.accountInformation.options', { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3 className={styles.subsubheading}>{t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.title')}</h3>
        <p>
          {t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.details')}
          <a href={t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.links.0.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}>
            {t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.links.0.name')}
          </a>
          {t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.details-1')}
        </p>
        <p>
          {t('privacyPolicy.privacyRights.cookiesAndSimilarTechnologies.question')}
          <a href="mailto:rateministere@gmail.com" className={styles.address}>rateministere@gmail.com</a>.
        </p>
      </div>

      <div className={styles.section}>
        <h2 id="do-not-track" className={styles.subheading}>{t('privacyPolicy.doNotTrack.title')}</h2>
        <p>{t('privacyPolicy.doNotTrack.short')}</p>
      </div>

      <div className={styles.section}>
        <h2 id="updates" className={styles.subheading}>{t('privacyPolicy.updates.title')}</h2>
        <p>{t('privacyPolicy.updates.short')}</p>
        <p>{t('privacyPolicy.updates.details')}</p>
      </div>

      <div className={styles.contactSection}>
        <h2 id="contact" className={styles.contactHeading}>{t('privacyPolicy.contact.title')}</h2>
        <p>{t('privacyPolicy.contact.description')}</p>
        <address className={styles.address}>
          {t('privacyPolicy.contact.address.company')}<br />
          {/*{t('privacyPolicy.contact.address.street')}<br />*/}
          {t('privacyPolicy.contact.address.city')}<br />
          {t('privacyPolicy.contact.address.country')}<br />
          <a href={`mailto:${t('privacyPolicy.contact.address.email')}`} className={styles.address}>
            {t('privacyPolicy.contact.address.email')}
          </a>
        </address>
      </div>

      <div className={styles.section}>
        <h2 id="review-update-delete" className={styles.subheading}>{t('privacyPolicy.reviewUpdateDelete.title')}</h2>
        <p>{t('privacyPolicy.reviewUpdateDelete.short', { dataRequestLink: "[Link to data request form]" })}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;