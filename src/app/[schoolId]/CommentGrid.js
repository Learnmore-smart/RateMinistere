"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { LoaderCircle } from 'lucide-react';
import { ChatsCircle, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import styles from "./styles/SchoolCardDetail.module.css";
import ReportButton from '@/app/components/ReportButton';
import ReportModal from '../components/ReportModal';
import { CustomToggle } from "@/app/components/inputs"


const ReplyCard = ({
    reply,
    onVote,
    onNotLogin,
    setComments,
    schoolId,
    schoolName,
    criteria,
    setIsSignUpModalOpen,
    onReport
}) => {
    const [showVoteButtons, setShowVoteButtons] = useState(false);
    const session = useSession();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!reply.accountId) return;
                const response = await fetch(`/api/user/display/${reply.accountId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [reply.accountId]);

    const handleVote = async (voteType) => {
        if (session.status === "unauthenticated") {
            onNotLogin();
            return;
        }
        try {
            const response = await fetch('/api/comments/reply/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    replyId: reply._id,
                    voteType
                })
            });

            const data = await response.json();
            if (data.error) {
                toast.error(data.modalMessage);
                return;
            }
            if (data.success) {
                // Find the comment that contains this reply and update it.  Very important, do by reference.
                setComments(prevComments => {
                    const newComments = [...prevComments];
                    const commentIndex = newComments.findIndex(c => c.replies.some(r => r._id === data.reply._id));
                    if (commentIndex !== -1) {
                        const replyIndex = newComments[commentIndex].replies.findIndex(r => r._id === data.reply._id);
                        if (replyIndex !== -1) {
                            newComments[commentIndex].replies[replyIndex] = data.reply;
                        }
                    }
                    return newComments;
                });

                toast.success(data.modalMessage);
            }
        } catch (error) {
            console.error('Error voting:', error);
            toast.error("Error voting on reply.");
        }
    };

    if (!reply?.votes) return null;

    const upvotes = reply.votes.filter(vote => vote.upVote).length;
    const downvotes = reply.votes.filter(vote => !vote.upVote).length;
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const hasUpvote = reply.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === true);
    const hasDownvote = reply.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === false);

    return (
        <div className={`${styles['reply-card-wrapper']}`}>
            <div className={`${styles['reply-card-content']} ${showVoteButtons ? styles['show-vote-buttons'] : ''}`}
                onMouseEnter={() => setShowVoteButtons(true)}
                onMouseLeave={() => setShowVoteButtons(false)}
            >
                <div className={`${styles['comment-vote-buttons']} ${showVoteButtons ? styles['visible'] : ''}`}>
                    <div className={styles['vote-buttons']}>
                        <button className={`${styles['upvote-btn']} ${hasUpvote ? styles['on'] : ''}`}
                            onClick={() => handleVote('upvote')}>
                            <ThumbsUp weight="bold" size={20} />
                        </button>
                        <button className={`${styles['downvote-btn']} ${hasDownvote ? styles['on'] : ''}`}
                            onClick={() => handleVote('downvote')}>
                            <ThumbsDown weight="bold" size={20} />
                        </button>
                    </div>
                </div>
                <div className={styles['reply-card']}>
                    <span className={styles['reply-comment']}>
                        <div className={styles['user-info']}>
                            <img
                                src={userData?.profilePicture || "/images/Default-user-image.png"}
                                alt={userData?.name || "Anonymous"}
                                className={styles['user-avatar']}
                            />
                            <span className={styles['username']}>{userData?.name || "Anonymous"}</span>
                        </div>
                        {reply.comment}</span>
                    <ReportButton
                        content={reply.comment}
                        type="school-reply"
                        schoolName={schoolName}
                        schoolId={schoolId}
                        criteriaName={criteria.name}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport}
                        commentId={reply._id}
                    />
                    <div className={styles['comment-vote-bar-wrapper']}>
                        <div className={styles['vote-counts']}>
                            {upvotes > 0 && <span className={styles['upvote-count']}>{upvotes}</span>}
                            {downvotes > 0 && <span className={styles['downvote-count']}>{downvotes}</span>}
                        </div>
                        <div className={`${styles['comment-vote-ratio-bar-reply']} ${totalVotes === 0 ? styles['no-votes'] : ''}`}>
                            <div className={styles['comment-vote-ratio-upvotes']}
                                style={{ width: `${upvotePercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CommentCard = ({
    comment,
    onVote,
    onNotLogin,
    schoolId,
    schoolName,
    setComments,
    setIsSignUpModalOpen,
    criteria,
    onReport,
    commentDetails
}) => {
    const [showVoteButtons, setShowVoteButtons] = useState(false);
    const session = useSession();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimeoutRef = useRef(null);
    const replyFormRef = useRef(null);
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!comment.accountId) return;
                const response = await fetch(`/api/user/display/${comment.accountId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [comment.accountId]);

    const handleVote = (voteType) => {
        if (session.status === "authenticated") {
            onVote(comment._id, voteType);
        } else {
            onNotLogin();
        }
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/schoolcomments/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: comment._id,
                    replyText: replyText,
                    schoolId: schoolId,
                }),
            });

            const data = await response.json();

            if (data.message === "Blocked") {
                toast.error(data.moderationResult);
                return;
            }

            if (data.message === "Successfully moderated") {
                setComments(prevComments => {
                    const newComments = [...prevComments];
                    const commentIndex = newComments.findIndex(c => c._id === comment._id);
                    if (commentIndex !== -1) {
                        newComments[commentIndex].replies.push(data.savedReply);
                    }
                    return newComments;
                });

                setReplyText('');
                setIsReplying(false);  //Close after succesfull submit
                toast.success(
                    <div>
                        {t('reply.success')}
                    </div>, {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                }
                );
            } else {
                toast.error("Failed to submit reply.");
            }
        } catch (error) {
            console.error('Reply error:', error);
            toast.error("Error submitting reply.");
        } finally {
            submitTimeoutRef.current = setTimeout(() => {
                setIsSubmitting(false);
            }, 10000);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                replyFormRef.current &&
                !replyFormRef.current.contains(event.target) &&
                !event.target.closest(`.${styles['reply-btn']}`)
            ) {
                setIsReplying(false);
            }
        };
        if (isReplying) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isReplying]);

    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    // Load isReplying state from localStorage
    useEffect(() => {
        const storedIsReplying = localStorage.getItem(`isReplying_${comment._id}`);
        if (storedIsReplying) {
            setIsReplying(JSON.parse(storedIsReplying));
        }
        const storedReplyText = localStorage.getItem(`replyText_${comment._id}`);
        if (storedReplyText) {
            setReplyText(storedReplyText);
        }
    }, [comment._id]); // Depend on comment._id

    // Save isReplying state to localStorage
    useEffect(() => {
        localStorage.setItem(`isReplying_${comment._id}`, JSON.stringify(isReplying));
        localStorage.setItem(`replyText_${comment._id}`, replyText);

    }, [isReplying, comment._id, replyText]);

    const toggleReply = () => {
        if (session.status === "unauthenticated") {
            setIsSignUpModalOpen(true);
            return;
        } else {
            setIsReplying(!isReplying);
        }
    };

    const upvotes = comment.votes.filter(vote => vote.upVote).length;
    const downvotes = comment.votes.filter(vote => !vote.upVote).length;
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const hasUpvote = comment.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === true);
    const hasDownvote = comment.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === false);


    return (
        <div className={styles['comment-card-wrapper']}>
            <div className={`${styles['comment-card-section']} ${showVoteButtons ? styles['show-vote-buttons'] : ''}`}
                onMouseEnter={() => setShowVoteButtons(true)}
                onMouseLeave={() => setShowVoteButtons(false)}>
                <div className={`${styles['comment-vote-buttons']} ${showVoteButtons ? styles['visible'] : ''}`}>
                    <div className={styles['vote-buttons']}>
                        <button className={`${styles['upvote-btn']} ${hasUpvote ? styles['on'] : ''}`}
                            onClick={() => handleVote('upvote')}>
                            <ThumbsUp weight="bold" size={20} />
                        </button>
                        <button className={`${styles['downvote-btn']} ${hasDownvote ? styles['on'] : ''}`}
                            onClick={() => handleVote('downvote')}>
                            <ThumbsDown weight="bold" size={20} />
                        </button>
                        <button className={`${styles['reply-btn']}`} onClick={toggleReply}>
                            <ChatsCircle weight="bold" size={20} />
                        </button>
                    </div>
                </div>
                <div className={styles['comment-card']}
                    style={{ '--overlay-width': `${Math.round(comment.overall * 20)}%` }}
                >
                    <div>
                        <div className={styles['comment-criteria-ratings']}>
                            <div className={styles['user-info']}>
                                <img
                                    src={userData?.profilePicture || "/images/Default-user-image.png"}
                                    alt={userData?.name || "Anonymous"}
                                    className={styles['user-avatar']}
                                />
                                <span className={styles['username']}>{userData?.name || "Anonymous"}</span>
                            </div>
                            <span>{comment.comment}</span>
                        </div>
                    </div>
                    <ReportButton
                        content={comment.comment}
                        type="school-comment"
                        schoolId={schoolId} // Add school ID
                        schoolName={schoolName} // Pass school name
                        criteriaName={criteria.name} // Pass criteria name
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport} // Add this line
                        commentId={comment._id} // Add this line
                    />
                    {commentDetails && (
                        <div className={`${styles["comment-criteria-details"]} ${styles.visible}`}>

                            <p>
                                {t("schoolRatingCriteria.Academic-Focus.name")}: {comment.academicFocus}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Support-System.name")}: {comment.supportSystem}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.School-Culture.name")}: {comment.schoolCulture}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Extracurriculars.name")}: {comment.extracurriculars}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Surveillant-Attitude.name")}: {comment.surveillantAttitude}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Teacher-Quality.name")}: {comment.teacherQuality}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Class-Quality.name")}: {comment.classQuality}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Club.name")}: {comment.club}
                            </p>
                            <p>
                                {t("schoolRatingCriteria.Location.name")}: {comment.location}
                            </p>
                        </div>
                    )}
                    <div className={styles['comment-vote-bar-wrapper']}>
                        <div className={styles['vote-counts']}>
                            {upvotes > 0 && (
                                <span key="upvote" className={styles['upvote-count']}>
                                    {upvotes}
                                </span>
                            )}
                            {downvotes > 0 && (
                                <span key="downvote" className={styles['downvote-count']}>
                                    {downvotes}
                                </span>
                            )}
                        </div>
                        <div className={`${styles['comment-vote-ratio-bar']} ${totalVotes === 0 ? styles['no-votes'] : ''}`}>
                            <div className={styles['comment-vote-ratio-upvotes']}
                                style={{ width: `${upvotePercentage}%` }} />
                        </div>
                    </div>
                </div>

            </div>
            {isReplying && (
                <form ref={replyFormRef} className={styles['reply-form']} onSubmit={handleReplySubmit}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={handleReplyChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(e); }}
                        placeholder={t("TeacherCardDetail.placeholder.reply")}
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        className={`${styles['reply-submit-btn']} ${isSubmitting ? styles['submitting'] : ''}`}
                        disabled={isSubmitting}
                    >
                        <div className={styles['button-content']}>
                            <span className={styles['button-text']}>{t("TeacherCardDetail.submit")}</span>
                            {isSubmitting && (
                                <LoaderCircle
                                    className={styles['submit-spinner']}
                                    size={20}
                                    strokeWidth={2.5}
                                />
                            )}
                        </div>
                    </button>
                </form>
            )}
            <div className={styles['replies-container']}>
                {comment.replies && comment.replies.map(reply => (
                    <ReplyCard
                        key={reply._id}
                        reply={reply}
                        onVote={handleVote}
                        onNotLogin={onNotLogin}
                        setComments={setComments}
                        schoolId={schoolId}     // Pass schoolId
                        schoolName={schoolName}
                        criteria={criteria}     // Pass criteria
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport} // Add this line
                    />
                ))}
            </div>
        </div>
    );
};

// Update CommentGrid to include criteria prop
const CommentGrid = ({
    comments,
    onVote,
    onNotLogin,
    schoolId,
    setComments,
    setIsSignUpModalOpen,
    schoolName,
    criteria,     // Add criteria
    onReport  // Add this line
}) => {
    const [commentDetails, setCommentDetails] = useState(false);
    const { t } = useTranslation();
    const [distributedComments, setDistributedComments] = useState([[], [], []]);

    useEffect(() => {
        const distributeComments = () => {
            const columns = [[], [], []];
            const columnHeights = [0, 0, 0];

            comments.forEach((comment) => {
                const estimatedHeight = Math.max(100, comment.comment.length * 0.5);
                const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
                columns[minColumnIndex].push(comment);
                columnHeights[minColumnIndex] += estimatedHeight;
            });
            setDistributedComments(columns);
        };

        distributeComments();
    }, [comments]);


    return (
        <div>
            <CustomToggle
                checked={commentDetails}
                onChange={() => { setCommentDetails(!commentDetails) }}
                label={t("TeacherCardDetail.commentdetails")}
            />

            <div className={styles['comments-grid']}>
                {distributedComments.map((column, columnIndex) => (
                    <div key={`column-${columnIndex}`} className={styles['comments-column']}>
                        {column.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                schoolName={schoolName}
                                onVote={onVote}
                                onNotLogin={onNotLogin}
                                schoolId={schoolId}
                                setComments={setComments}
                                setIsSignUpModalOpen={setIsSignUpModalOpen}
                                criteria={criteria}
                                onReport={onReport}
                                commentDetails={commentDetails}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentGrid;