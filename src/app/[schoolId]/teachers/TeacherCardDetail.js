"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { convertToCamelCase } from '@/app/utils/stringUtils';
import { getCriteria, getSubjectTranslation } from '@/app/utils/subjectUtils';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';
import { CaretCircleDoubleRight } from '@phosphor-icons/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import Image from 'next/image';
import ratingStyles from './styles/TeacherRatingModal.module.css';
import styles from './styles/TeacherCardDetail.module.css';
import TeacherRatingModal from './TeacherRatingModal';
import WatchOutModal from './WatchOutRatingModal';
import SignUpModal from '@/app/components/SignUpModal';
import ReportButton from '@/app/components/ReportButton';
import ReportModal from '@/app/components/ReportModal';
import CommentGrid from './CommentGrid'

const TeacherCardDetail = ({ isOpen, onClose, teacher, schoolId }) => {  // Add schoolId here
    const { t } = useTranslation();
    const router = useRouter();
    const ratingCriteria = getCriteria();
    const [isClosing, setIsClosing] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isWatchOutModalOpen, setIsWatchOutModalOpen] = useState(false); // State for WatchOut modal
    const [comments, setComments] = useState([]);
    const [watchOutComments, setWatchOutComments] = useState([]); // State to store
    const [showAllComments, setShowAllComments] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFlipButtonVisible, setIsFlipButtonVisible] = useState(true);

    const session = useSession();
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [replies, setReplies] = useState({});
    const commentsContainerRef = useRef(null);
    const contentRef = useRef(null); //  Ref for the .content element

    // Add reportModalData state
    const [reportModalData, setReportModalData] = useState(null);

    // Add this near your other state declarations
    const [showReportModal, setShowReportModal] = useState(false);

    // Add this state near your other useState declarations
    const [commentUserData, setCommentUserData] = useState({});

    // Modify your handleReport function
    const handleReport = (reportData) => {
        setReportModalData(reportData);
        setShowReportModal(true);  // Open the modal when report is clicked
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
            toast.error(t('report.error'), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        setReportModalData(null);
    };

    const fetchWatchOutComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/watchOut?teacherId=${teacher._id}`);
            const data = await res.json();
            if (data && Array.isArray(data.watchOutComments)) {
                setWatchOutComments(data.watchOutComments); // Update state
            } else {
                console.error("Invalid watchOutComments data:", data);
                setWatchOutComments([]);
            }
        } catch (error) {
            console.error("Error in watchOut:", error);
            setWatchOutComments([]); // Safe default
        }

    }, [teacher._id]);

    const fetchComments = useCallback(async () => {
        const res = await fetch(`/api/comments?tid=${teacher._id}`);
        const data = await res.json();
        return data.dbResults;
    }, [teacher._id]);

    const fetchReplies = useCallback(async (commentId) => {
        try {
            const response = await fetch(`/api/comments/${commentId}/reply`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.replies || [];
        } catch (error) {
            console.error(`Error fetching replies:`, error);
            return [];
        }
    }, []);

    // Add this fetch function after your other fetch functions
    const fetchUserData = async (accountId) => {
        try {
            if (!accountId) return;
            const response = await fetch(`/api/user/display/${accountId}`);
            if (response.ok) {
                const data = await response.json();
                setCommentUserData(prev => ({
                    ...prev,
                    [accountId]: data
                }));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const userDisplayCache = []

    const fetchUserDisplay = async (userId) => {
        try {
            if (userDisplayCache[userId]) return userDisplayCache[userId];

            const res = await fetch('/api/user/display/' + userId);
            if (!res.ok) {
                throw new Error(`Failed to fetch display: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            userDisplayCache[userId] = data;
            return data
        } catch (error) {
            console.error("Error fetching user display:", error);
        }
    }

    // Modify your useEffect that fetches comments to also fetch user data
    useEffect(() => {
        fetchComments().then(fetchedComments => {
            if (fetchedComments) {
                setComments(fetchedComments);
                // Fetch user data for each comment
                fetchedComments.forEach(comment => {
                    if (comment.accountId) {
                        fetchUserData(comment.accountId);
                    }
                    fetchReplies(comment._id).then(fetchedReplies => {
                        setReplies(prevReplies => ({
                            ...prevReplies,
                            [comment._id]: fetchedReplies
                        }));
                    });
                });
            }
        });
        fetchWatchOutComments();
    }, [fetchComments, fetchReplies, fetchWatchOutComments]);

    const handleCloseAllComments = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const allCommentsModal = document.querySelector(`.${styles['all-comments-modal']}`);
        if (allCommentsModal) {
            allCommentsModal.classList.add(styles['closing']);
            setTimeout(() => setShowAllComments(false), 300);
        }
    };

    const handleVote = async (commentId, voteType) => {
        if (session.status === "unauthenticated") {
            setIsSignUpModalOpen(true);
            return;
        }
        try {
            const response = await fetch('/api/comments/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId,
                    voteType,
                    teacherId: teacher._id
                })
            });

            const data = await response.json();
            if (data.redirect) {
                router.push(data.destination);
                return;
            }
            if (data.error) {
                toast.error(data.modalMessage); // Changed to toast
                return;
            }
            if (data.success) {
                setComments(prevComments => {
                    // Create a new array by mapping over the existing comments
                    const updatedComments = prevComments.map(comment => {
                        // If the _id matches, return the new comment, otherwise return the old comment
                        if (comment._id === data.comment._id) {
                            return data.comment;
                        }
                        return comment;
                    });

                    return updatedComments;
                });

                toast.success(
                    <div>
                        {t("votes.success")}
                    </div>);
            }
        } catch (error) {
            console.error('Error voting:', error);
            toast.error(
                <div>
                    {t("Error.ratings.teachers")}
                </div>, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
        }
    };

    const handleReplySubmit = async (commentId, replyText) => {
        console.log('Session data:', session.data);
        console.log('Username being sent:', session.data.user.name);
        try {
            const response = await fetch('/api/comments/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: commentId,
                    replyText: replyText
                })
            });

            const data = await response.json();
            if (data.message === "Blocked") {
                toast.error(data.moderationResult);
                return null;
            }
            if (data.message === "Successfully moderated") {
                const repliesForComment = await fetchReplies(commentId);
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [commentId]: repliesForComment
                }));
                toast.success(
                    <div>
                        {t('reply.success')}
                    </div>);

                return data.savedReply;
            }
        } catch (error) {
            console.error('Reply error:', error);
            toast.error(<div>{t("Error.ratings.teachers")}</div>); // Changed to toast
            return null;
        }
    };

    const calculatePertinence = (comment) => {
        return (comment.upvotes * 2) + comment.downvotes;
    };

    const sortedComments = comments.filter(item => item.comment?.trim())
        .sort((a, b) => calculatePertinence(b) - calculatePertinence(a));

    const getCriteriaAverage = (criteriaName) => {
        return teacher[convertToCamelCase(criteriaName)] || 0;
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const alreadyRatedDetector = (accountId) => {
        if (!comments || !Array.isArray(comments)) {
            return false;
        }
        return comments.some(comment =>
            comment &&
            comment.accountId.toString() === accountId.toString()
        );
    };

    const toggleFlip = () => {
        if (!isFlipButtonVisible) return;
        setIsFlipButtonVisible(false);
        setIsFlipped(prev => !prev);
        setTimeout(() => setIsFlipButtonVisible(true), 600);
    };


    useEffect(() => {
        if (contentRef.current) {
            if (isFlipped) {
                contentRef.current.classList.remove(styles['unflipped']);
                contentRef.current.classList.add(styles['flipped']);
            } else {
                contentRef.current.classList.remove(styles['flipped']);
                contentRef.current.classList.add(styles['unflipped']);
            }
        }
    }, [isFlipped]);

    if (!isOpen) return null;

    return (
        <>
            <div className={`${ratingStyles['rating-modal-overlay']} ${isClosing ? ratingStyles['closing'] : ''}`}>
                <div className={`${styles['rating-modal']} ${isClosing ? styles['closing'] : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className={styles['rating-buttons']}>
                        {/* Watch Out Button - Now opens the WatchOutModal */}
                        <button
                            className={styles['voter-button']}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsWatchOutModalOpen(true);
                            }}
                        >
                            <Image
                                src="/images/Watch-out.png"
                                alt="Watch Out button"
                                fill
                                style={{ objectFit: 'cover', borderRadius: '10px' }}
                                priority
                            />
                        </button>
                        <button
                            className={styles['voter-button']}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsRatingModalOpen(true);
                            }}
                        >
                            <Image
                                src="/images/Rateministere.png"
                                alt="Rate button"
                                fill
                                style={{ objectFit: 'cover', borderRadius: '10px' }}
                                priority
                            />
                        </button>
                    </div>
                    <button onClick={handleClose} className={styles["close-button"]}><X /></button>
                    <div className={styles['comment-seperate']}>
                        <div className={styles['teacher-details']}>
                            <div className={ratingStyles['rating-modal-header']}>
                                <div>
                                    <h2>{teacher.name}</h2>
                                    <p className={styles['detail-role']}>{getSubjectTranslation(teacher.role)}</p>
                                    <p className={styles['detail-school']}>{teacher.school}</p>
                                </div>
                                <div className={styles['overall-rating']}>
                                    <div className={styles['rating-number']}><span>{teacher.rating.toFixed(1)}</span></div>
                                    <p className={styles['total-ratings']}>
                                        {t('TeacherCardDetail.totalRating', { numRatings: teacher.numRatings })}
                                    </p>
                                </div>
                            </div>

                            <div className="teacher-detail-container">
                                <div className={styles['teacher-stats']}>
                                    <div className={styles['criteria-ratings']}>
                                        {ratingCriteria.map((criteria) => (
                                            <div key={criteria.key} className={styles['criteria-rating-container']}>
                                                <div className={styles['criteria-header']}>
                                                    <span className={styles['criteria-icon']}>{criteria.icon}</span>
                                                    <span className={styles['criteria-name']}>{criteria.name}</span>
                                                </div>
                                                <div className={styles['criteria-right']}>
                                                    <div className={styles['criteria-bar-wrapper']}>
                                                        <div className={styles['criteria-bar-fill']}
                                                            style={{ width: `${(getCriteriaAverage(criteria.key) / 5) * 100}%` }} />
                                                    </div>
                                                    <span className={styles['criteria-score']}>
                                                        {getCriteriaAverage(criteria.key).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div >
                                        ))}
                                    </div >
                                </div >
                            </div >
                        </div >
                        <div className={styles['comments-container']} ref={commentsContainerRef}>
                            <button
                                className={`${styles['flip-button']} ${!isFlipButtonVisible ? styles['hidden'] : ''}`}
                                onClick={toggleFlip}
                            >
                                <CaretCircleDoubleRight weight="bold" className={styles['flip-icon']} />
                            </button>

                            <div className={`${styles['content']} ${isFlipped ? styles['flipped'] : ''}`} ref={contentRef}>
                                <div className={styles['recent-comments']}>
                                    <div className={styles['recent-comments-bg']}></div>
                                    <h3>{t('TeacherCardDetail.recentComments')}</h3>
                                    <div className={styles['recent-comments-scrollable']}>
                                        {sortedComments.slice(0, 3).map((comment, index) => (
                                            <div key={index}
                                                className={styles['comment-card']}
                                                style={{ '--overlay-width': `${Math.round(comment.overallRating * 20)}%`, marginBottom: "10px" }}
                                            >
                                                <div>
                                                    <div className={styles['comment-criteria-ratings']}>
                                                        <div className={styles['user-info']}>
                                                            <img
                                                                src={commentUserData[comment.accountId]?.profilePicture || "/images/Default-user-image.png"}
                                                                alt={commentUserData[comment.accountId]?.name || "Anonymous"}
                                                                className={styles['user-avatar']}
                                                            />
                                                            <span className={styles['username']}>
                                                                {commentUserData[comment.accountId]?.name || "Anonymous"}
                                                            </span>
                                                        </div>
                                                        <span>{comment.comment}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {sortedComments.length > 0 ? (
                                        <div>
                                            <button className={styles['see-all-comments-btn']} onClick={() => setShowAllComments(true)}>
                                                <span>{t('all-comments.title')}</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{t('TeacherCardDetail.firstComment')}</p>
                                    )}
                                </div>
                                <div className={styles['watch-out-section']}>
                                    <div className={styles['watch-out-section-bg']}></div>
                                    <h3>{t('TeacherCardDetail.watchOut')}</h3>
                                    {watchOutComments.length > 0 ? (
                                        watchOutComments.map((watchOutComment, index) => (
                                            <div key={index} className={styles['watch-out-comment']}>
                                                <span>{watchOutComment.comment}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>{t('TeacherCardDetail.noWatchOut')}</p>
                                    )}
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
                < TeacherRatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    teacher={teacher}
                    alreadyRatedDetector={alreadyRatedDetector}
                />
                <WatchOutModal
                    isOpen={isWatchOutModalOpen}
                    onClose={() => setIsWatchOutModalOpen(false)}
                    teacher={teacher}
                    schoolId={schoolId}  // Add this line
                    alreadyRatedDetector={alreadyRatedDetector}
                />

                {showAllComments && (
                    <div className={styles['all-comments-modal']} onClick={e => e.stopPropagation()}>
                        <div className={styles['all-comments-container']}>
                            <button className={styles['close-all-comments-btn']} onClick={handleCloseAllComments}>
                                <X />
                            </button>
                            <CommentGrid
                                comments={sortedComments}
                                teacher={teacher} // Pass teacher prop
                                onVote={handleVote}
                                onNotLogin={() => setIsSignUpModalOpen(true)}
                                onReplySubmit={handleReplySubmit}
                                replies={replies}
                                setReplies={setReplies}
                                setIsSignUpModalOpen={setIsSignUpModalOpen} // Pass setIsSignUpModalOpen
                                schoolId={schoolId} // Pass schoolId
                                onReport={handleReport} // Add this line
                            />
                        </div>
                    </div>
                )}
                <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />

                {/* Add this ReportModal */}
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => {
                        setShowReportModal(false);
                        setReportModalData(null);
                    }}
                    onSubmit={handleReportSubmit}
                />

            </div >

            <ToastContainer
                position="top-right"
                autoClose={9000}
                hideProgressBar={false}
                newestOnBottom
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
            />
        </>
    );
};

export default TeacherCardDetail;