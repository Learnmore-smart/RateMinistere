"use client";
import { useState, useEffect } from "react";
import styles from "./Savebar.module.css";
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

function LoadingCircle({ width = "65px", height = "65px", ...props }) {
    return (
        <svg
            className={styles.spinner}
            width={width}
            height={height}
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                className={styles["spinner-path"]}
                fill="none"
                strokeLinecap="round"
                cx="33"
                cy="33"
                r="30"
            />
        </svg>
    );
}

export default function SaveBar({ resetClick, saveClick, originalProfile, settings, showSaveBar, ...otherProps }) {
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(showSaveBar);
    const { t } = useTranslation();
    useEffect(() => {
        // Automatically close the SaveBar if changes are reverted
        if (originalProfile && Object.keys(originalProfile).every(key => {
            return originalProfile[key] === settings[key];
        })) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [originalProfile, settings]);

    const handleReset = async () => {
        setLoading(true);
        try {
            await resetClick();
            setIsVisible(false); // Close the SaveBar after resetting changes
        } finally {
            setLoading(false);
        }
    };

    const SaveFunction = async (e) => {
        setLoading(true);
        try {
            await saveClick(e);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = (action) => {
        if ("vibrate" in navigator) {
            navigator.vibrate(100);
        }
        if (action) {
            action();
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ y: '120%' }}
            animate={{ y: isVisible ? 0 : '120%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            transformTemplate={
                (latest, generated) => `translateX(-50%) ${generated}`
            }
            {...otherProps}
        >
            {loading && (
                <div className={styles.overlay}>
                    <LoadingCircle width="20px" height="20px" />
                </div>
            )}
            <p className={styles.text}>{t("SaveBar.unsaved_changes")}</p>
            <div className={styles.buttons}>
                <button
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={() => handleButtonClick(handleReset)}
                >
                    <p>{t("SaveBar.cancel")}</p>
                </button>
                <button
                    className={`${styles.button} ${styles.saveButton}`}
                    onClick={() => handleButtonClick(SaveFunction)}
                >
                    <p>{t("SaveBar.save")}</p>
                </button>
            </div>
        </motion.div>
    );
}