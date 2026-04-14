"use client"
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import styles from './loading.module.css';
import { LoaderCircle } from 'lucide-react';

const Canvas = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const minimumLoadingTime = 2000; // 2 seconds
  const timerRef = useRef(null);


  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShow(false);
    }, minimumLoadingTime);

    return () => clearTimeout(timerRef.current);
  }, []);

  function TranslatedPImage(p) {
    const originalText = p.replace(/<special>/g, `<p>`).replace(/<\/special>/g, '</span>');

    return <p className={styles["loadingText"]} dangerouslySetInnerHTML={{ __html: originalText }} />;
  }
  return show ? (
    <div className={styles.loadingContainer}>
      <div className={styles.logoContainer}>
        <Image
          src="/rateministere/images/Rateministere.png"
          alt="Rateministere Logo"
          width={150}
          height={150}
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      {TranslatedPImage(t('Loadingpage.loading'))}
      <div className={styles.loadingSpinner}>
        <LoaderCircle className={styles.spinIcon} />
      </div>
    </div>
  ) : null;
};

export default Canvas;