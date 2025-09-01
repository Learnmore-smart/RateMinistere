import Link from "next/link";
import styles from './footer.module.css'
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className={styles.footercontainer}>
      <div className={styles.footerbuttons}>
        <Link href="/privacy-policy" target="_blank" className={styles.footerbutton}>
          {t('footer.privacy_policy')}
        </Link>
        <Link href="/terms-and-conditions" target="_blank" className={styles.footerbutton}>
          {t('footer.terms_and_conditions')}
        </Link>
        <Link href="/guidelines" target="_blank" rel="noopener noreferrer" className={styles.footerbutton}>
          {t('footer.community_guidelines')}
        </Link>
        <Link href="/Contact-us" target="_blank" rel="noopener noreferrer" className={styles.Contactbutton}>
          {t('Contact.title')}
        </Link>
      </div>
      <p className={styles.footercopyright}>© 2025 RateMinistère. All rights reserved.</p>
      <p className={styles.footerversion}>Version 1.9.0</p>
    </div>
  );
}