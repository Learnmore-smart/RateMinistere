"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ChatsCircle, ThumbsUp, ThumbsDown } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import styles from './styles/TeacherCardDetail.module.css';
import ReportButton from '@/app/components/ReportButton';
import { CustomToggle } from "@/app/components/inputs"

const ReplyCard = ({
    comment,  // Add comment prop to access comment._id
    reply: initialReply,
    onNotLogin,
    onReplySubmit,
    replies,
    setReplies,
    teacher,
    schoolId,  // Add schoolId prop
    setIsSignUpModalOpen,
    onReport  // Add this
}) => {
    const { t } = useTranslation(); // Add this line
    const [showVoteButtons, setShowVoteButtons] = useState(false);
    const session = useSession();
    const [reply, setReply] = useState(initialReply)
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
            if (data.redirect) {
                router.push(data.destination);
                return;
            }
            if (data.error) {
                toast.error(data.modalMessage); // Changed to toast
                return;
            }
            if (data.success) {
                setReply(data.reply)
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

    const upvotes = reply.votes.filter(vote => vote.upVote).length;
    const downvotes = reply.votes.filter(vote => !vote.upVote).length;
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const hasUpvote = reply.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === true);
    const hasDownvote = reply.votes.some(vote => vote.accountId.toString() === session?.data?.user?.id && vote.upVote === false);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const replyFormRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimeoutRef = useRef(null);
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

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/comments/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: replies._id,
                    replyText: replyText,
                })
            });
            const newReply = await onReplySubmit(comment._id, replyText);
            if (newReply) {
                setReplyText('');
                setIsReplying(false);
            }
        } catch (error) {
            console.log("error submitting reply", error);
        } finally {
            submitTimeoutRef.current = setTimeout(() => {
                setIsSubmitting(false);
            }, 10000);
        }
    };
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    const toggleReply = () => {
        setIsReplying(!isReplying);
    };

    return (
        <div className={styles['reply-card-wrapper']}>
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
                        {/*<button className={`${styles['reply-btn']}`} onClick={toggleReply}>
                            <ChatsCircle weight="bold" size={20} />
                        </button> */}
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
                        type="teacher-reply"
                        teacherName={teacher.name}
                        commentId={reply._id} // Add commentId
                        schoolId={schoolId}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport}  // Add this
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
            {/*             {isReplying && (
                <form ref={replyFormRef} className={styles['reply-form']} onSubmit={handleReplySubmit}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={handleReplyChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(e); }}
                            placeholder={t("TeacherCardDetail.placeholder.reply")}
                   disabled={isSubmitting} // Disable input during submission
                    />
                    <button
                        type="submit"
                        className={`${styles['reply-submit-btn']} ${isSubmitting ? styles['submitting'] : ''}`}
                        disabled={isSubmitting}
                    >
                        <div className={styles['button-content']}>
                            <span className={styles['button-text']}>Submit</span>
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
                {(replies[comment._id] || []).map(reply => (
                    <ReplyCard
                        key={reply._id}
                        reply={reply}
                        onVote={onVote}
                        onNotLogin={onNotLogin}
                    />
                ))}
            </div> */}
        </div>
    );
};

const CommentCard = ({
    comment,
    onVote,
    onNotLogin,
    teacher,
    schoolId,
    onReplySubmit,
    replies,
    setReplies,
    setIsSignUpModalOpen,
    onReport,
    commentDetails
}) => { // Receive setIsSignUpModalOpen
    const [showVoteButtons, setShowVoteButtons] = useState(false);
    const session = useSession();
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const replyFormRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimeoutRef = useRef(null);
    const { t } = useTranslation();  //  useTranslation hook
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
            const response = await fetch('/api/comments/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: comment._id,
                    replyText: replyText
                })
            });
            const newReply = await onReplySubmit(comment._id, replyText);
            if (newReply) {
                setReplyText('');
                setIsReplying(false);
            }
        } catch (error) {
            console.log("error submitting reply", error);
        } finally {
            submitTimeoutRef.current = setTimeout(() => {
                setIsSubmitting(false);
            }, 10000);
        }
    };
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    const toggleReply = () => {
        if (session.status === "unauthenticated") {
            setIsSignUpModalOpen(true); // Open SignUpModal
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
                onMouseLeave={() => setShowVoteButtons(false)}
                style={{ '--overlay-width': `${Math.round(comment.overallRating * 20)}%` }}>
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
                    style={{
                        '--overlay-width': `${Math.round(comment.overallRating * 20)}%`
                    }}>
                    <div>
                        <div className={styles['comment-criteria-ratings']}>
                            <div className={styles['user-info']}>
                                <img
                                    src={userData?.profilePicture || "/images/Default-user-image.png"}
                                    alt={userData?.name || "Anonymous"} // Changed from username to accountName
                                    className={styles['user-avatar']}
                                />
                                <span className={styles['username']}>{userData?.name || "Anonymous"}</span>
                            </div>
                            <span>{comment.comment}</span>
                        </div>
                    </div>
                    <ReportButton
                        content={comment.comment}
                        type="teacher-comment"
                        teacherName={teacher.name}
                        commentId={comment._id} // Add commentId
                        schoolId={schoolId}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport}  // Add this
                    />
                    {
                        commentDetails && (
                            <div className={`${styles["comment-criteria-details"]} ${styles.visible}`}>
                                <p>
                                    {t("ratingCriteria.Teaching Quality.name")}:{" "}
                                    {comment.teachingQuality}
                                </p>
                                <p>
                                    {t("ratingCriteria.Engagement.name")}: {comment.engagement}
                                </p>
                                <p>
                                    {t("ratingCriteria.Fairness.name")}: {comment.fairness}
                                </p>
                                <p>
                                    {t("ratingCriteria.Support.name")}: {comment.support}
                                </p>
                                <p>
                                    {t("ratingCriteria.Ease.name")}: {comment.ease}
                                </p>
                            </div>
                        )
                    }
                    <div className={styles['comment-vote-bar-wrapper']}>
                        <div className={styles['vote-counts']}>
                            {upvotes > 0 && <span className={styles['upvote-count']}>{upvotes}</span>}
                            {downvotes > 0 && <span className={styles['downvote-count']}>{downvotes}</span>}
                        </div>
                        <div className={`${styles['comment-vote-ratio-bar']} ${totalVotes === 0 ? styles['no-votes'] : ''}`}>
                            <div className={styles['comment-vote-ratio-upvotes']}
                                style={{ width: `${upvotePercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>
            {
                isReplying && (
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
                )
            }
            <div className={styles['replies-container']}>
                {(replies[comment._id] || []).map(reply => (
                    <ReplyCard
                        key={reply._id}
                        reply={reply}
                        comment={comment}
                        teacher={teacher}
                        schoolId={schoolId}
                        onVote={onVote}
                        onNotLogin={onNotLogin}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        onReport={onReport}
                    />
                ))}
            </div>
        </div >
    );
};
const CommentGrid = ({
    comments,
    teacher,
    onVote,
    onNotLogin,
    schoolId,
    onReplySubmit,
    replies,
    setReplies,
    setIsSignUpModalOpen,
    onReport
}) => {
    const [commentDetails, setCommentDetails] = useState(false);
    const [distributedComments, setDistributedComments] = useState([[], [], []]);
    const gridRef = useRef(null);
    const { t } = useTranslation();

    // Add resize observer to handle height changes
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            distributeComments();
        });

        if (gridRef.current) {
            observer.observe(gridRef.current);
        }

        return () => {
            if (gridRef.current) {
                observer.unobserve(gridRef.current);
            }
        };
    }, []);

    const distributeComments = () => {
        const columns = [[], [], []];
        const columnHeights = [0, 0, 0];

        comments.forEach((comment) => {
            // Adjust height estimation to account for possible details
            const baseHeight = Math.max(100, comment.comment.length * 0.5);
            const estimatedHeight = commentDetails ? baseHeight * 1.5 : baseHeight;

            const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            columns[minColumnIndex].push(comment);
            columnHeights[minColumnIndex] += estimatedHeight;
        });
        setDistributedComments(columns);
    };

    useEffect(() => {
        distributeComments();
    }, [comments, commentDetails]); // Add commentDetails as dependency


    return (
        <div>
            <CustomToggle
                checked={commentDetails}
                onChange={() => { setCommentDetails(!commentDetails) }}
                label={t("TeacherCardDetail.commentdetails")}
            />
            <div className={styles['comments-grid']}>
                {distributedComments.map((column, columnIndex) => (
                    <div key={columnIndex} className={styles['comments-column']}>
                        {column.map((comment, commentIndex) => (
                            <CommentCard
                                key={commentIndex}
                                comment={comment}
                                teacher={teacher}
                                schoolId={schoolId}
                                onVote={onVote}
                                onNotLogin={onNotLogin}
                                onReplySubmit={onReplySubmit}
                                replies={replies}
                                setReplies={setReplies}
                                setIsSignUpModalOpen={setIsSignUpModalOpen}
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

export default CommentGrid