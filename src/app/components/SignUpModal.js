'use client'
import { useState, useEffect } from 'react';
import styles from './SignUpModal.module.css';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { signIn } from 'next-auth/react'
import Script from 'next/script';
import { FcGoogle } from "react-icons/fc";
import { X } from 'lucide-react';

export default function SignUpModal({ isOpen, onClose }) {
  useEffect(() => {
    window.onloadTurnstileCallback = () => {
      console.log("Turnstile script loaded");
    };
    window.turnstileCallback = (token) => {
      console.log("Turnstile Callback received token:", token);
      setTurnstileToken(token);
      setIsTurnstileVerified(true);
    };
    return () => {
      delete window.onloadTurnstileCallback;
      delete window.turnstileCallback;
    };
  }, []);

  const handleButtonClick = (action) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
    if (action) {
      action();
    }
  };

  const isDevelopment = process.env.NODE_ENV === 'development';
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(isDevelopment ? true : false);
  const TURNSTILE_SITE_KEY = '0x4AAAAAAA1uE3spJTimfbln';

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleGoogleSignIn = async () => {
    if (isDevelopment) {
      try {
        setIsLoading(true);
        await signIn('google');
        return;
      } catch (error) {
        console.error('Google Sign In error:', error);
        setErrors({
          signup: 'An error occurred during sign in'
        });
      } finally {
        setIsLoading(false);
      }
    }

    try {
      const response = await fetch('/api/turnstile/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const result = await response.json();

      if (!result.success) {
        setErrors({
          signup: 'Security verification failed. Please try again.'
        });
        return;
      }

      setIsLoading(true);
      await signIn('google');
    } catch (error) {
      console.error('Turnstile verification error:', error);
      alert('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}>
        <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`}>
          <button className={styles.closeButton} onClick={handleClose}><X /></button>
          <div className={styles.form}>
            <h2>{t('signup.title')}</h2>
            <p className={styles.subtitle}>{t('signup.title-2')}</p>
            <button
              type="button"
              className={`${styles.socialButton}`}
              onClick={() => handleButtonClick(handleGoogleSignIn)}
              disabled={isLoading || !isTurnstileVerified}
            >
              <FcGoogle className={styles.googleIcon} />
              <p>{isLoading ? t('signup.loading') : t('signup.socialButtons.googleSignUp')}</p>
            </button>
            {/* Cloudflare Turnstile */}
            <div className={styles.turnstileContainer}>
              {!isDevelopment && (
                <>
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                    strategy="lazyOnload"
                  />

                  <div
                    className="cf-turnstile"
                    data-sitekey={TURNSTILE_SITE_KEY}
                    data-callback="turnstileCallback"
                    data-theme="auto"
                  />
                </>
              )}
            </div>
            {errors.email && (
              <div className={styles.errorMessage}>{errors.email}</div>
            )}
            {errors.signup && (
              <div className={styles.errorMessage}>{errors.signup}</div>
            )}
            <p className={styles.terms}>
              {t('signup.terms.agreementText')}{' '}
              <Link href="/privacy-policy" target="_blank">
                {t('signup.terms.privacyPolicy')}
              </Link>{' '}
              {t('signup.terms.and')}{' '}
              <Link href="/terms-and-conditions" target="_blank">
                {t('signup.terms.termsAndConditions')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}