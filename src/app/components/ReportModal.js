"use client";
import React, { useState } from 'react';
import styles from './styles/ReportModal.module.css';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowSquareOut } from '@phosphor-icons/react';

const ReportModal = ({
    isOpen,
    onClose,
    onSubmit,
    content,
    type,
    contextName,
    commentId,
    schoolId,
}) => {
    const { t } = useTranslation();
    const [reportReason, setReportReason] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reportReason.trim().length < 10) {
            setError(t('ReportModal.minimumWords'));
            return;
        }
        onSubmit(reportReason);
        handleClose();
    };

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`}>
                <button onClick={handleClose} className={styles["close-button"]}>
                    <X />
                </button>
                <h2>{t('ReportModal.title')}</h2>
                <div>
                    <Link href="/guidelines" target="_blank" rel="noopener noreferrer" className={styles['guidelines-link']}>
                        <div>
                            <div className={styles['guidelines-intro']}>
                                <span>{t('TeacherRatingModal.guidelinesIntro')}</span><ArrowSquareOut weight="bold" />
                            </div>
                            <div className={styles['guidelines-text']}>
                                <span>
                                    {t('TeacherRatingModal.guidelinesPoints', { returnObjects: true }).map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className={styles.reportedContent}>
                    <h3>{t('ReportModal.reportedContent')}</h3>
                    <p>{content}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder={t('ReportModal.reasonPlaceholder')}
                        maxLength={300}
                        className={styles.reasonInput}
                    />
                    <div className={styles.characterCount}>
                        {reportReason.length}/300
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={reportReason.trim().length < 10}
                    >
                        {t('ReportModal.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;