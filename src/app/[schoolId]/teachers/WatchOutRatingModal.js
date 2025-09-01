"use client";
import React, { useState } from 'react';
import styles from './styles/WatchOutRatingModal.module.css';
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";
import SignUpModal from '@/app/components/SignUpModal';
import { X } from 'lucide-react';
import Link from 'next/link';
import { ArrowSquareOut } from '@phosphor-icons/react';
import ReportButton from '@/app/components/ReportButton';
import ReportModal from '@/app/components/ReportModal';

const WatchOutModal = ({
    isOpen,
    onClose,
    teacher,
    schoolId,
    alreadyRatedDetector,
    onReport,
    ...otherprops
}) => {
    const { t } = useTranslation();
    const session = useSession({ required: false });
    const [comment, setComment] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [isModeratingComment, setIsModeratingComment] = useState(false);
    const [reportModalData, setReportModalData] = useState(null);

    const moderateComment = async (comment) => {
        setIsModeratingComment(true);

        const body = {
            review: comment,
            teacherId: teacher._id,
            schoolId: schoolId,
        };

        try {
            const response = await fetch('/api/watchOut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error moderating comment');
            }

            setIsModeratingComment(false);

            if (data.moderationResult?.includes("APPROVED")) {
                return true;
            }

            setCommentError(data.moderationResult?.replace("BLOCKED", "").trim() || "Comment was not approved");
            return false;
        } catch (error) {
            console.error("Moderation error:", error);
            setIsModeratingComment(false);
            setCommentError(error.message || t("Error.comments.moderation"));
            return false;
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        if (value.length <= 250) {
            setComment(value);
            setCommentError('');
        } else {
            setComment(value.slice(0, 250));
            setCommentError('Limited to 250 chars');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.length > 250) {
            setCommentError('Limited to 250 chars');
            return;
        }

        if (comment.trim()) {
            const isCommentAppropriate = await moderateComment(comment);
            if (!isCommentAppropriate) {
                return;
            }
        }

        const watchOutData = {
            schoolId: schoolId,
            comment: comment,
            commentId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        try {
            const response = await fetch('/api/watchOut', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(watchOutData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit comment.');
            }

        } catch (error) {
            console.error("Submission error:", error);
            setCommentError(error.message || 'An error occurred.');
            return;
        }

        setIsModeratingComment(false);
        setComment('');
        handleClose();
    };

    const handleReport = (reportData) => {
        setReportModalData(reportData);
    };

    const handleReportSubmit = async (reason) => {
        if (!reportModalData || !session.data) return;

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: reportModalData.content,
                    type: reportModalData.type,
                    teacherName: teacher.name,
                    schoolId: schoolId,
                    commentId: reportModalData.commentId,
                    reason: reason,
                    reporter: {
                        name: session.data.user.name,
                        email: session.data.user.email
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit report');
            }

            toast.success(t('report.success'));
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error(t('report.error'));
        }

        setReportModalData(null);
    };

    if (!isOpen) return null;

    if (session.status !== "authenticated") return (<SignUpModal isOpen={isOpen} onClose={onClose} />)

    return (
        <>
            <div onClick={e => e.stopPropagation()} className={`${styles['rating-modal-overlay']} ${isClosing ? styles['closing'] : ''}`} {...otherprops}>
                <div className={`${styles['rating-modal-sub']} ${styles['rating-modal']} ${isClosing ? styles['closing'] : ''}`}>
                    <div>
                        <div className={styles['rating-modal-header']}>
                            <h2>{t('WatchOutModal.watchOutFor', { teacherName: teacher.name })}</h2>
                            <button onClick={handleClose} className={styles['close-button']}><X /></button>
                        </div>
                        {alreadyRatedDetector && (alreadyRatedDetector(session?.data?.user?.id) || alreadyRatedDetector(teacher._id)) ? (
                            <div>
                                {t('WatchOutModal.alreadyCommented', { teacherName: teacher.name })}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles['rating-form']}>
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
                                <div className={styles['rating-comment']}>
                                    <textarea
                                        placeholder={t('WatchOutModal.commentPlaceholder')}
                                        value={comment}
                                        onChange={handleCommentChange}
                                        maxLength={250}
                                        disabled={isModeratingComment}
                                    />
                                    <div className={styles['character-count']}>
                                        {comment.length}/250
                                    </div>
                                    {isModeratingComment && (
                                        <div className={styles['moderation-status']}>
                                            <p>{t("WatchOutModal.moderateComments")}</p>
                                        </div>
                                    )}
                                    {commentError && (
                                        <div className={styles['comment-error']}>
                                            {commentError}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className={styles['submit-rating-button']}
                                >
                                    <p>{t('WatchOutModal.submitComment')}</p>
                                </button>
                            </form>
                        )}
                    </div>
                    {watchOutComments && watchOutComments.map((comment, index) => (
                        <div key={index} className={styles.comment}>
                            <p>{comment.comment}</p>
                            <ReportButton
                                content={comment.comment}
                                type="teacher-watchout"
                                teacherName={teacher.name}
                                commentId={comment._id}
                                schoolId={schoolId}
                                setIsSignUpModalOpen={setIsSignUpModalOpen}
                                onReport={handleReport}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {reportModalData && (
                <ReportModal
                    isOpen={!!reportModalData}
                    onClose={() => setReportModalData(null)}
                    onSubmit={handleReportSubmit}
                    {...reportModalData}
                />
            )}
        </>
    );
};

export default WatchOutModal;