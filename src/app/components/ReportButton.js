'use client';
import { Flag } from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { reportForModeration } from '@/app/utils/moderationUtils';
import styles from './ReportButton.module.css';
import { useTranslation } from 'react-i18next';
import Tooltip from '../components/Tooltip';

const ReportButton = ({
    content,
    type,
    teacherName,
    schoolId,
    schoolName,
    criteriaName,
    commentId,
    onReport,
    setIsSignUpModalOpen
}) => {
    const session = useSession();
    const { t } = useTranslation();

    const handleClick = () => {
        if (session.status === "unauthenticated") {
            setIsSignUpModalOpen(true);
            return;
        }
        onReport({
            content,
            type,
            teacherName,
            schoolId,
            schoolName,
            criteriaName,
            commentId
        });
    };

    return (
        <div className={styles.reportButtonWrapper}>
            <Tooltip text={t('report.tooltip')} position="left">
                <button
                    className={styles.reportButton}
                    onClick={handleClick}
                >
                    <Flag size={16} weight="bold" />
                </button>
            </Tooltip>
        </div>
    );
};

export default ReportButton;