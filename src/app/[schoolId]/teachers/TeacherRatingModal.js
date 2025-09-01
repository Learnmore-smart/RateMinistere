"use client";
import React, { useState } from 'react';
import styles from './styles/TeacherRatingModal.module.css'
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { convertToCamelCase } from '@/app/utils/stringUtils';
import { getCriteria } from '@/app/utils/subjectUtils';
import { useSession } from "next-auth/react";
import SignUpModal from '@/app/components/SignUpModal';
import { X } from 'lucide-react';
import {ArrowSquareOut } from '@phosphor-icons/react';

const TeacherRatingModal = ({ isOpen, onClose, teacher, alreadyRatedDetector, initialRating, initialComment, ...otherprops }) => {
    const { t } = useTranslation();

    const session = useSession({
        required: false
    })

    const ratingCriteria = getCriteria();

    const initialRatings = initialRating || Object.fromEntries(
        ratingCriteria.map(criteria => [convertToCamelCase(criteria.key), 0])
    );

    const [ratings, setRatings] = useState(initialRatings);
    const [hoveredRatings, setHoveredRatings] = useState({});
    const [comment, setComment] = useState(initialComment || '');
    const [isClosing, setIsClosing] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [activeHoverCriteria, setActiveHoverCriteria] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(''); // State for current description
    const [isModeratingComment, setIsModeratingComment] = useState(false);

    // New AI Moderation Function
    const moderateComment = async (comment) => {
        setIsModeratingComment(true);

        const body = {
            review: comment,
            teacherId: teacher._id,
            ratings
        }

        try {
            const response = await fetch('/api/comments', {
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

    const getDescription = (rating) => {
        switch (rating) {
            case 1: return t("TeacherRatingModal.ratings.1");
            case 2: return t("TeacherRatingModal.ratings.2");
            case 3: return t("TeacherRatingModal.ratings.3");
            case 4: return t("TeacherRatingModal.ratings.4");
            case 5: return t("TeacherRatingModal.ratings.5");
            default: return "";
        }
    };

    const handleRatingChange = (criteriaName, value) => {
        setRatings(prev => ({
            ...prev,
            [convertToCamelCase(criteriaName)]: value
        }));
    };

    const handleHover = (criteriaName, value) => {
        setActiveHoverCriteria(criteriaName);
        setHoveredRatings(prev => ({
            ...prev,
            [convertToCamelCase(criteriaName)]: value
        }));
    };

    const handleContainerMouseLeave = (criteriaName) => {
        setActiveHoverCriteria(null);
        setHoveredRatings(prev => ({
            ...prev,
            [convertToCamelCase(criteriaName)]: 0
        }));
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
        if (value.length <= 300) {
            setComment(value);
            setCommentError('');
        } else {
            setComment(value.slice(0, 300));
            setCommentError('Commentaire limité à 300 caractères');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Validate ratings
        if (Object.values(ratings).some(rating => rating === 0)) {
            return;
        }

        // Check comment length
        if (comment.length > 300) {
            setCommentError('Commentaire limité à 300 caractères');
            return;
        }

        // If comment exists, perform AI moderation
        if (comment.trim()) {
            const isCommentAppropriate = await moderateComment(comment);
            if (!isCommentAppropriate) {
                return;
            }
        }

        const rating = {
            teacherId: teacher._id,
            ratings: ratings
        };

        try {
            const response = await fetch('/api/teachers', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rating),
            });

            const data = await response.json();
            if (response.ok) {
                setCurrentDescription(t('TeacherRatingModal.successRating', { teacherName: teacher.name }));
            } else {
                setCurrentDescription(t('TeacherRatingModal.failedRating', { message: data.message }));
            }
        } catch (error) {
            setCurrentDescription(t('TeacherRatingModal.errorRating'));
            console.log(error)
        }

        setIsModeratingComment(false)
        setRatings(initialRatings);
        setComment('');
        handleClose();
    };

    const getCircleColor = (position) => {
        switch (position) {
            case 1:
                return styles['circle-red'];
            case 2:
                return styles['circle-orange'];
            case 3:
                return styles['circle-yellow'];
            case 4:
                return styles['circle-green'];
            case 5:
                return styles['circle-blue'];
            default:
                return '';
        }
    };

    if (!isOpen) return null;

    if (session.status !== "authenticated") return (<SignUpModal isOpen={isOpen} onClose={onClose} />)

    return (
        <div onClick={e => e.stopPropagation()} className={`${styles['rating-modal-overlay']} ${isClosing ? styles['closing'] : ''}`} {...otherprops}>
            <div className={`${styles['rating-modal-sub']} ${styles['rating-modal']} ${isClosing ? styles['closing'] : ''}`}>
                <div>
                    <div className={styles['rating-modal-header']}>
                        <h2>{t('TeacherRatingModal.rateTeacher', { teacherName: teacher.name })}</h2>
                        <button onClick={handleClose} className={styles['close-button']}><X /></button>
                    </div>
                    {alreadyRatedDetector && (alreadyRatedDetector(session?.data?.user?.id) || alreadyRatedDetector(teacher._id)) ? (
                        <div>
                            {t('TeacherRatingModal.ratealready', { teacherName: teacher.name })}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles['rating-form']}>
                            {ratingCriteria.map((criteria) => (
                                <div key={criteria.key} className={styles['criteria-container']}>
                                    <div className={styles['criteria-header']}>
                                        <span className={styles['criteria-icon']}>{criteria.icon}</span>
                                        <div className={styles['criteria-info']}>
                                            <h3>{criteria.name}</h3>
                                            <p>{criteria.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles['circles-container']}
                                        onMouseLeave={() => handleContainerMouseLeave(criteria.key)}>
                                        <div className={styles['circles-row']}>
                                            {[1, 2, 3, 4, 5].map((circle) => {
                                                const isActive = activeHoverCriteria === criteria.key;
                                                const currentValue = hoveredRatings[convertToCamelCase(criteria.key)] ||
                                                    ratings[convertToCamelCase(criteria.key)];
                                                const shouldBeColored = isActive
                                                    ? circle <= currentValue
                                                    : circle <= ratings[convertToCamelCase(criteria.key)];

                                                return (
                                                    <button
                                                        key={circle}
                                                        type="button"
                                                        className={`${styles['circle-button']} ${shouldBeColored ? getCircleColor(circle) : ''}`}
                                                        onClick={() => {
                                                            handleRatingChange(criteria.key, circle);
                                                        }}
                                                        onMouseEnter={() => handleHover(criteria.key, circle)}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className={styles['rating-labels']}>
                                            {ratings[convertToCamelCase(criteria.key)] === 0 ? (
                                                <>
                                                    <span className={styles['left-label']}>{t('TeacherRatingModal.ratings.1')}</span>
                                                    <span className={styles['right-label']}>{t('TeacherRatingModal.ratings.5')}</span>
                                                </>
                                            ) : (
                                                <div className={styles['selected-rating']}>
                                                    {getDescription(ratings[convertToCamelCase(criteria.key)])}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <Link href="/guidelines" target="_blank" rel="noopener noreferrer" className={styles['guidelines-link']}>
                                    <div>
                                        <div className={styles['guidelines-intro']}>
                                            <span>{t('TeacherRatingModal.guidelinesIntro')}</span><ArrowSquareOut weight="bold"/>
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
                                    placeholder={t('TeacherRatingModal.commentPlaceholder')}
                                    value={comment}
                                    onChange={handleCommentChange}
                                    maxLength={300}
                                    disabled={isModeratingComment}
                                />
                                <div className={styles['character-count']}>
                                    {comment.length}/300
                                </div>
                                {isModeratingComment && (
                                    <div className={styles['moderation-status']}>
                                        {t("TeacherRatingModal.moderateComments")}
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
                                disabled={Object.values(ratings).some(rating => rating === 0)}
                            >
                                <p>{t('TeacherRatingModal.submitRating')}</p>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherRatingModal;