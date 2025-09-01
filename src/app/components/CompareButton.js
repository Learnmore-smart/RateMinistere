// CompareButton.jsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { SquareSplitHorizontal } from '@phosphor-icons/react';
import styles from './CompareButton.module.css';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const CompareButton = () => {
    const { t } = useTranslation();
    const [isComparing, setIsComparing] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [activeView, setActiveView] = useState(null);  // Keep track of active view
    const timeoutRef = useRef(null);

    useEffect(() => {
        const url = new URL(window.location.href);
        const isInIframe = url.searchParams.get('inIframe') === 'true';

        if (!isInIframe) {
            setCurrentUrl(window.location.origin + window.location.pathname + window.location.search);

            const savedCompareState = localStorage.getItem('isComparing');
            if (savedCompareState === 'true') {
                setIsComparing(true);
                document.body.style.overflow = 'hidden';
                setShowMessage(true);
                timeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isComparing) {
                setIsComparing(false);
                document.body.style.overflow = 'auto';
                localStorage.setItem('isComparing', 'false');
                setShowMessage(false);
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isComparing]);

    const handleCompareClick = () => {
        if (new URL(window.location.href).searchParams.get('inIframe') !== 'true') {
            const newState = !isComparing;
            setIsComparing(newState);
            document.body.style.overflow = newState ? 'hidden' : 'auto';
            localStorage.setItem('isComparing', newState.toString());

            if (newState) {
                setShowMessage(true);
                timeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
            } else {
                setShowMessage(false);
                setActiveView(null); // Reset active view when closing
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            }
        }
    };

    const isInIframe = new URL(window.location.href).searchParams.get('inIframe') === 'true';
    if (isInIframe) {
        return null;
    }

    return (
        <>
            <button className={styles.compareButton} onClick={handleCompareClick}>
                <SquareSplitHorizontal size={24} className={styles.compareIcon} />
            </button>

            {isComparing && createPortal(
                <div className={styles.splitContainer}>
                    <div
                        className={`${styles.splitView} ${activeView === 'left' ? styles.active : ''}`}
                        onClick={() => setActiveView('left')}
                    >
                        <iframe
                            src={`${currentUrl}${currentUrl.includes('?') ? '&' : '?'}inIframe=true`}
                            className={styles.splitFrame}
                            title="Left comparison view"
                            scrolling="yes"
                        />
                        <button className={styles.closeCompare} onClick={handleCompareClick}>
                            <X className={styles.closeIcon} />
                        </button>
                    </div>
                    <div
                        className={`${styles.splitView} ${activeView === 'right' ? styles.active : ''}`}
                        onClick={() => setActiveView('right')}
                    >
                        <iframe
                            src={`${currentUrl}${currentUrl.includes('?') ? '&' : '?'}inIframe=true`}
                            className={styles.splitFrame}
                            title="Right comparison view"
                            scrolling="yes"
                        />
                        <button className={styles.closeCompare} onClick={handleCompareClick}>
                            <X className={styles.closeIcon} />
                        </button>
                    </div>
                    {showMessage && (
                        <div className={styles.messageContainer}>
                            <p>{t("SplitScreen.ESC")}</p>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

export default CompareButton;