"use client";
import React, { useState, useEffect } from 'react';
import styles from './teachers/styles/TeacherRatingModal.module.css';
import newStyles from './teachers/styles/SchoolRatingModal.module.css';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { convertToCamelCase } from '@/app/utils/stringUtils';
import { getCriteria } from '@/app/utils/schoolsubjectUtils';
import { useSession } from "next-auth/react";
import SignUpModal from '@/app/components/SignUpModal';
import { CaretDown, ArrowSquareOut } from '@phosphor-icons/react';

const SchoolRatingModal = ({ isOpen, onClose, schoolId, schoolName, alreadyRatedDetector, ...otherprops }) => {
    const { t } = useTranslation();
    const schoolRatingCriteria = getCriteria();
    const session = useSession({
        required: false
    });

    const initialRatings = Object.fromEntries(
        schoolRatingCriteria.map(criteria => [convertToCamelCase(criteria.key), 0])
    );

    const [ratings, setRatings] = useState(initialRatings);
    const [hoveredRatings, setHoveredRatings] = useState({});
    const [comment, setComment] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [activeHoverCriteria, setActiveHoverCriteria] = useState('');
    const [currentDescription, setCurrentDescription] = useState('');
    const [isModeratingComment, setIsModeratingComment] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState('');
    const [commentCriteria, setCommentCriteria] = useState('');


    const moderateComment = async (comment) => {
        setIsModeratingComment(true);

        const body = {
            review: comment,
            schoolId: schoolId,
            commentCriteria: selectedCriteria,
            ratings
        }

        try {
            const chatCompletion = await fetch('/api/schoolcomments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await chatCompletion.json();

            const moderationResult = data.moderationResult;

            setIsModeratingComment(false);

            if (data.moderationResult?.includes("APPROVED")) {
                return true;
            }
            setCommentError(data.moderationResult?.replace("BLOCKED", "").trim());
            return false;
        } catch (error) {
            console.error("Moderation error:", error);
            setIsModeratingComment(false);
            setCommentError(t("Error.comments.moderation"))
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
            setCommentError(t('SchoolRatingModal.commentError'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(ratings).some(rating => rating === 0)) {
            return;
        }

        // Check comment length
        if (comment.length > 300) {
            setCommentError(t('SchoolRatingModal.commentError'));
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
            schoolId: schoolId,
            ratings: ratings,
            commentCriteria: commentCriteria
        };

        try {
            const response = await fetch('/api/schools', { // Update API endpoint for schools
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rating),
            });

            const data = await response.json();
            if (response.ok) {
                // Award points for rating a school
                await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'school_rating',
                        points: 3
                    }),
                });
                setCurrentDescription(t('SchoolRatingModal.successRating', { schoolName: schoolName }));
            } else {
                setCurrentDescription(t('SchoolRatingModal.failedRating', { message: data.message }));
            }

        } catch (error) {
            setCurrentDescription(t('SchoolRatingModal.errorRating'));
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

    const fetchSchool = async (schoolId) => {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`)
        const school = await res.json()
        return school.dbResults
    }
    const [school, setSchool] = useState({});
    useEffect(() => {
        fetchSchool(schoolId).then((fetchedSchool) => {
            if (fetchedSchool == 'No school found' || !fetchedSchool) {
                return redirect('/school-not-found')
            }
            setSchool(fetchedSchool)
        })
    }, []);


    if (!isOpen) return null;

    if (session.status !== "authenticated") return (<SignUpModal isOpen={isOpen} onClose={onClose} />)

    return (
        <div className={`${styles['rating-modal-overlay']} ${isClosing ? styles['closing'] : ''}`} {...otherprops}>
            <div className={`${styles['rating-modal-sub']} ${styles['rating-modal']} ${isClosing ? styles['closing'] : ''}`}>
                <div>
                    <div className={styles['rating-modal-header']}>
                        <h2>{school.name}</h2>
                        <button onClick={handleClose} className={styles['close-button']}>×</button>
                    </div>
                    {alreadyRatedDetector && alreadyRatedDetector(session?.data?.user?.id) ? (
                        <div>
                            {t('SchoolRatingModal.ratealready', { schoolName: schoolName })}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles['rating-form']}>
                            {/* Individual Criteria Ratings */}
                            {schoolRatingCriteria.map((criteria) => {
                                const criteriaKey = convertToCamelCase(criteria.key);
                                return (
                                    <div key={criteria.key} className={styles['criteria-container']}>
                                        <div className={styles['criteria-header']}>
                                            <span className={styles['criteria-icon']}>
                                                {criteria.icon}
                                            </span>
                                            <div className={styles['criteria-info']}>
                                                <h3>{criteria.name}</h3>
                                                <p>{criteria.description}</p>
                                            </div>
                                        </div>
                                        <div className={styles['circles-container']}
                                            onMouseLeave={() => handleContainerMouseLeave(criteriaKey)}>
                                            <div className={styles['circles-row']}>
                                                {[1, 2, 3, 4, 5].map((circle) => {
                                                    const isActive = activeHoverCriteria === criteriaKey;
                                                    const currentValue = hoveredRatings[criteriaKey] || ratings[criteriaKey];
                                                    const shouldBeColored = isActive
                                                        ? circle <= currentValue
                                                        : circle <= ratings[criteriaKey];

                                                    return (
                                                        <button
                                                            key={circle}
                                                            type="button"
                                                            className={`${styles['circle-button']} ${shouldBeColored ? getCircleColor(circle) : ''}`}
                                                            onClick={() => handleRatingChange(criteriaKey, circle)}
                                                            onMouseEnter={() => handleHover(criteriaKey, circle)}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <div className={styles['rating-labels']}>
                                                {ratings[criteriaKey] === 0 ? (
                                                    <>
                                                        <span className={styles['left-label']}>{t('TeacherRatingModal.ratings.1')}</span>
                                                        <span className={styles['right-label']}>{t('TeacherRatingModal.ratings.5')}</span>
                                                    </>
                                                ) : (
                                                    <div className={styles['selected-rating']}>
                                                        {getDescription(ratings[criteriaKey])}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={styles['guidelines-link-container']}>
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
                            <div>
                                <div className={newStyles['comment-criteria-dropdown']}>
                                    <select
                                        value={commentCriteria}
                                        onChange={(e) => {
                                            setCommentCriteria(e.target.value)
                                            setSelectedCriteria(e.target.value)
                                        }}
                                        className={newStyles['criteria-dropdown']}
                                    >
                                        {schoolRatingCriteria.map((criteria) => (
                                            <option key={criteria.key} value={convertToCamelCase(criteria.key)}>
                                                {criteria.name}
                                            </option>
                                        ))}
                                    </select>
                                    <CaretDown
                                        className={newStyles['caret-icon']}
                                    />
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
                                        <div className={newStyles['moderation-status']}>
                                            {t("TeacherRatingModal.moderateComments")}
                                        </div>
                                    )}
                                    {commentError && (
                                        <div className={newStyles['comment-error']}>
                                            {commentError}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`${Object.values(ratings).some(rating => rating === 0) ? styles['disabled'] : ''} ${styles['submit-rating-button']}`}
                                disabled={Object.values(ratings).some(rating => rating === 0)}
                            >
                                {t('TeacherRatingModal.submitRating')}
                            </button>
                            {currentDescription && <p className={styles['submit-message']}>{currentDescription}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolRatingModal;
