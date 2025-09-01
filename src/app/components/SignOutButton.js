"use client"
import { signOut, useSession } from "next-auth/react"
import styles from "./SignOutButton.module.css"
import { useTranslation } from "react-i18next"
import SignUpModal from "./SignUpModal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { CircleUserRound } from 'lucide-react';

const truncateUsername = (username) => {
  if (username.length > 10) {
    return username.substring(0, 10) + '...';
  }
  return username;
};


export default function SignOut({ text, className, navbar, icon: Icon, ...otherprops }) {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession({ required: false });
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleButtonClick = (action) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
    action();
  };

  if (session.status === "authenticated") {
    return (
      <button
        {...otherprops}
        className={`${className ? className : ''} ${styles["signup-button"]}`}
        onClick={() => handleButtonClick(() => navbar ? router.push('/profile') : signOut())}
      >
        {Icon && <Icon className={styles.signupIcon} />}
        <div>
          <span className={styles.placeholderText}>{navbar ? truncateUsername(session.data.user.name) : t('SignOutButton.logOut')}</span>
          <span className={styles.text}>{navbar ? truncateUsername(session.data.user.name) : t('SignOutButton.logOut')}</span>

        </div>
      </button>
    );
  } else if (session.status === "loading") {
    return null;
  } else {
    return (
      <>
        <button
          {...otherprops}
          className={`${className ? className : ''} ${styles["signup-button"]}`}
          onClick={() => handleButtonClick(() => setIsSignUpModalOpen(true))}
        >
          <CircleUserRound className={styles.signupIcon} />
          <div>
            <span className={styles.placeholderText}>{text || t('Home.signUp')}</span>
            <span className={styles.text}>{text || t('Home.signUp')}</span>
          </div>
        </button>
        {isSignUpModalOpen && createPortal(
          <SignUpModal
            isOpen={isSignUpModalOpen}
            onClose={() => setIsSignUpModalOpen(false)}
          />,
          document.body
        )}
      </>
    )
  }
}
