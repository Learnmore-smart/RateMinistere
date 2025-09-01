'use client';
import React from 'react';
import styles from '../AstrAlumnaGuidelines/AstrAlumnaGuidelines.module.css';
import { useTranslation } from 'react-i18next';
import Tooltip from '../components/Tooltip';
import { Undo2 } from 'lucide-react';

const TermsAndConditions = () => {
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
      <h1 className={styles.title}>{t('termsAndConditions.termsAndConditionsTitle')}</h1>
      <p className={styles.lastUpdated}>{t('termsAndConditions.lastUpdated')}</p>
      <div className={styles.intro}>
        <p>{t('termsAndConditions.agreementToLegalTermsBody1')}</p>
        <p>
          {t('termsAndConditions.agreementToLegalTermsBody2')}
          <a
            href={t('termsAndConditions.links.0.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}
          >
            {t('termsAndConditions.links.0.name')}
          </a>
          {t('termsAndConditions.agreementToLegalTermsBody2-1')}
        </p>
        <p>{t('termsAndConditions.agreementToLegalTermsBody3')}</p>
        <p>
          <span>
            {t('termsAndConditions.agreementToLegalTermsBody4')}
            <a href="mailto:rateministere@gmail.com" className={`${styles.address} ${styles.emailLink}`}>
              rateministere@gmail.com
            </a>
            {t('termsAndConditions.agreementToLegalTermsBody4-1')}
          </span>
        </p>
        <p>{t('termsAndConditions.agreementToLegalTermsBody5')}</p>
        <p>{t('termsAndConditions.agreementToLegalTermsBody6')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.ourServicesTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.ourServicesBody1')}</p>
        <p>{t('termsAndConditions.ourServicesBody2')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.intellectualPropertyRightsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.intellectualPropertyRightsBody1')}</p>
        <p>
          {t('termsAndConditions.intellectualPropertyRightsBody2')}
          <a href="mailto:rateministere@gmail.com" className={`${styles.address} ${styles.emailLink}`}>
            rateministere@gmail.com
          </a>
          {t('termsAndConditions.intellectualPropertyRightsBody2-1')}
        </p>
        <p>{t('termsAndConditions.intellectualPropertyRightsBody3')}</p>
        <p>{t('termsAndConditions.intellectualPropertyRightsBody4')}</p>
        <p>{t('termsAndConditions.intellectualPropertyRightsBody5')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.userRepresentationsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.userRepresentationsBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.userRegistrationTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.userRegistrationBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.productsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.productsBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.purchasesAndPaymentTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.purchasesAndPaymentBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.subscriptionsTitle')}</h2>
      <div className={styles.section}>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.subscriptionsBillingRenewal')}</span>
        </p>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.subscriptionsFreeTrial')}</span>
        </p>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.subscriptionsCancellation')}</span>
        </p>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.subscriptionsFeeChanges')}</span>
        </p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.returnRefundsPolicyTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.returnRefundsPolicyBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.prohibitedActivitiesTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.prohibitedActivitiesBody')}</p>
        <ul className={styles.rulesList}>
          <li>{t('termsAndConditions.prohibitedActivitiesList0')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList1')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList2')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList3')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList4')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList5')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList6')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList7')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList8')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList9')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList10')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList11')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList12')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList13')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList14')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList15')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList16')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList17')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList18')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList19')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList20')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList21')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList22')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList23')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList24')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList25')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList26')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList27')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList28')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList29')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList30')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList31')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList32')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList33')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList34')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList35')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList36')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList37')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList38')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList39')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList40')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList41')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList42')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList43')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList44')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList45')}</li>
          <li>{t('termsAndConditions.prohibitedActivitiesList46')}</li>
        </ul>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.userGeneratedContributionsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.userGeneratedContributionsBody')}</p>
        <ul className={styles.recommendationsList}>
          <li>{t('termsAndConditions.userGeneratedContributionsList0')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList1')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList2')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList3')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList4')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList5')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList6')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList7')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList8')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList9')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList10')}</li>
          <li>{t('termsAndConditions.userGeneratedContributionsList11')}</li>
        </ul>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.contributionLicenseTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.contributionLicenseBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.guidelinesForReviewsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.guidelinesForReviewsBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.advertisersTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.advertisersBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.servicesManagementTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.servicesManagementBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.privacyPolicyTitle')}</h2>
      <div className={styles.section}>
        <p>
          {t('termsAndConditions.privacyPolicyTitle-1')}
          <a
            href={t('termsAndConditions.links.1.url')}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.address} ${styles.externalLinkIcon}`}
          >
            {t('termsAndConditions.links.1.name')}
          </a>
          {t('termsAndConditions.privacyPolicyTitle-2')}
        </p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.copyrightInfringementsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.copyrightInfringementsBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.termAndTerminationTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.termAndTerminationBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.modificationsAndInterruptionsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.modificationsAndInterruptionsBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.governingLawTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.governingLawBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.disputeResolutionTitle')}</h2>
      <div className={styles.section}>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.disputeResolutionInformalNegotiations')}</span>
        </p>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.disputeResolutionBindingArbitration', { arbitrationBody: '[Your Arbitration Body]' })}</span>
        </p>
        <p>
          <span className={styles.highlight}>{t('termsAndConditions.disputeResolutionExceptions')}</span>
        </p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.correctionsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.correctionsBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.disclaimerTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.disclaimerBody')}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.limitationsOfLiabilityTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.limitationsOfLiabilityBody', { liabilityLimit: '[YOUR LIABILITY LIMIT]' })}</p>
      </div>

      <h2 className={styles.subheading}>{t('termsAndConditions.indemnificationTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.indemnificationBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.userDataTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.userDataBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.electronicCommunicationsTransactionsAndSignaturesTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.electronicCommunicationsTransactionsAndSignaturesBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.californiaUsersAndResidentsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.californiaUsersAndResidentsBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.miscellaneousTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.miscellaneousBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.userGeneratedContentResponsibilityTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.userGeneratedContentResponsibilityBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.subscriptionPaymentTermsTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.subscriptionPaymentTermsBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.refundPolicyTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.refundPolicyBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.codeOfConductTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.codeOfConductBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.liabilityLimitationTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.liabilityLimitationBody')}</p>
      </div>


      <h2 className={styles.subheading}>{t('termsAndConditions.privacyAndDataSecurityTitle')}</h2>
      <div className={styles.section}>
        <p>{t('termsAndConditions.privacyAndDataSecurityBody')}</p>
      </div>



      <div className={styles.contactSection}>
        <h2 className={styles.contactHeading}>{t('termsAndConditions.contactUsTitle')}</h2>
        <p>{t('termsAndConditions.contactUsBody')}</p>
        <address className={styles.address}>
          {t('termsAndConditions.address.company')}<br />
          {/* {t('termsAndConditions.address.street')}<br /> */}
          {t('termsAndConditions.address.city')}<br />
          {t('termsAndConditions.address.country')}<br />
        </address>
        <a href="mailto:rateministere@gmail.com" className={`${styles.address} ${styles.emailLink}`}>
          rateministere@gmail.com
        </a>
      </div>
    </div>
  );
};

export default TermsAndConditions;