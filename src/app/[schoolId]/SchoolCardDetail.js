"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import { createPortal } from "react-dom";
import buttonstyles from "./school.module.css";
import Link from "next/link";
import Image from 'next/image';
import SignUpModal from "@/app/components/SignUpModal";
import styles from "./styles/SchoolCardDetail.module.css";
import SchoolRatingModal from "./SchoolRatingModal";
import CommentGrid from './CommentGrid'
import ReportModal from '../components/ReportModal';

const SchoolCardDetail = ({ isOpen, onClose, criteria, comments: initialComments, schoolId, schoolName }) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [comments, setComments] = useState([]); // Initialize as empty array
  const [showAllComments, setShowAllComments] = useState(false);
  const session = useSession();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState(null);
  const [usersData, setUsersData] = useState({}); // Store user data by accountId

  const fetchReplies = useCallback(async (commentId) => {
    try {
      const response = await fetch(`/api/schoolcomments/${commentId}/reply`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.replies || [];
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error);
      return [];
    }
  }, []);

  // Fetch user data for all comments *once*
  useEffect(() => {
    const fetchAllUsersData = async (commentsToProcess) => {
        const accountIds = commentsToProcess.map(comment => comment.accountId).filter(Boolean);
        const uniqueAccountIds = [...new Set(accountIds)]; // Remove duplicates

        const newUsersData = { ...usersData }; // Start with existing user data

        for (const accountId of uniqueAccountIds) {
          // Only fetch if we don't already have data for this user
          if (!newUsersData[accountId]) {
              try {
                const response = await fetch(`/api/user/display/${accountId}`);
                if (response.ok) {
                    const userData = await response.json();
                    newUsersData[accountId] = userData; // Store by accountId
                }
              } catch (error) {
                  console.error(`Error fetching user data for ${accountId}:`, error);
              }
          }
        }

        setUsersData(prevUsersData => ({ ...prevUsersData, ...newUsersData }));
    };

    const initializeComments = async () => {
      if (initialComments?.length) {
        const commentsWithReplies = await Promise.all(
          initialComments.map(async (comment) => {
            const replies = await fetchReplies(comment._id);
            return { ...comment, replies };
          })
        );
        setComments(commentsWithReplies);
        fetchAllUsersData(commentsWithReplies);  // Fetch user data AFTER setting comments
      }
    };

    initializeComments();
  }, [initialComments, fetchReplies, schoolId]); // Include schoolId if it can change

  const handleClose = () => {
    setIsClosing(true);
    // Clear localStorage when closing the modal
    comments.forEach(comment => {
      localStorage.removeItem(`isReplying_${comment._id}`);
      localStorage.removeItem(`replyText_${comment._id}`);

    });
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleCloseAllComments = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const allCommentsModal = document.querySelector(`.${styles['all-comments-modal']}`);
    if (allCommentsModal) {
      allCommentsModal.classList.add(styles['closing']);
      // Clear localStorage when closing All Comments
      comments.forEach(comment => {
        localStorage.removeItem(`isReplying_${comment._id}`);
        localStorage.removeItem(`replyText_${comment._id}`);

      });
      setTimeout(() => setShowAllComments(false), 300);
    }
  };

  const handleVote = async (commentId, voteType) => {
    if (session.status === "unauthenticated") {
      setIsSignUpModalOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/schoolcomments/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          voteType,
          schoolId: schoolId
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.modalMessage);
        return;
      }
      if (data.success) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment._id === data.comment._id) {
              return { ...data.comment, replies: comment.replies }; // Keep replies.
            }
            return comment;
          });
        });
        toast.success(data.modalMessage);
      }

    } catch (error) {
      console.error('Error voting:', error);
      toast.error(t("Error.ratings.schools"));
    }
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
          schoolName: reportModalData.schoolName,
          schoolId: reportModalData.schoolId,
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

      toast.success(t('report.success'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(t('report.error'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

    setReportModalData(null);
  };

  const sortedComments = comments
    ? [...comments].filter(item => item.comment?.trim()).sort((a, b) => {
      const aPertinence = (a.votes.filter(v => v.upVote).length * 2) - a.votes.filter(v => !v.upVote).length;
      const bPertinence = (b.votes.filter(v => v.upVote).length * 2) - b.votes.filter(v => !v.upVote).length;
      return bPertinence - aPertinence;
    })
    : [];

  const rating = criteria && typeof criteria.rating === 'number'
    ? criteria.rating
    : (criteria && typeof criteria.rating === 'string')
      ? parseFloat(criteria.rating)
      : 0;

  const alreadyRatedDetector = (accountId) => {
    if (!comments || !Array.isArray(comments)) {
      return false;
    }
    return comments.some(comment =>
      comment &&
      comment.accountId.toString() === accountId.toString()
    );
  };

const CommentPreview = React.memo(function CommentPreview({ comment, userData }) {
    return (
        <div className={styles['comment-card']}
             style={{'--overlay-width': `${Math.round(comment.overall * 20)}%`}}>
            <div>
                <div className={styles['comment-criteria-ratings']}>
                    <div className={styles['user-info']}>
                        <img
                            src={userData?.profilePicture || "/images/Default-user-image.png"}
                            alt={userData?.name || "Anonymous"}
                            className={styles['user-avatar']}
                        />
                        <span className={styles['username']}>
                            {userData?.name || "Anonymous"}
                        </span>
                    </div>
                    <span>{comment.comment}</span>
                </div>
            </div>
        </div>
    );
});

  if (!isOpen) return null;

  return (
    <>
      <div className={`${styles['rating-modal-overlay']} ${isClosing ? styles['closing'] : ''}`}>
        <div className={`${styles['rating-modal']} ${isClosing ? styles['closing'] : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className={styles['criteria-details']}>
            <button
              className={styles['voter-button']}
              onClick={(e) => {
                e.stopPropagation();
                setRatingModalOpen(true);
              }}
            >
              <div>
                <Image
                  src="/images/Rateministere.png"
                  alt="Rateministere.png"
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: '9px'
                  }}
                  priority
                />
              </div>
            </button>
            <div className={styles['criteria-header']}>
              <div className={styles['criteria-icon']}>{criteria.icon}</div>
              <h2>{criteria.name}</h2>
            </div>
            <div className={styles['criteria-content']}>
              <div className={styles['criteria-rating']}>
                <span>{rating.toFixed(1)}</span>
                <div className={styles['rating-bar']}>
                  <div className={styles['rating-fill']}
                    style={{ '--overlay-width': `${rating * 20}%` }} />
                </div>
              </div>
              <div className={styles['recent-comments']}>
                <h3>{t('TeacherCardDetail.recentComments')}</h3>
                {sortedComments.slice(0, 3).map((comment) => (
                    <CommentPreview key={comment._id} comment={comment} userData={usersData[comment.accountId]} />
                ))}
                {sortedComments.length > 0 && (
                  <div>
                    <button
                      className={styles['see-all-comments-btn']}
                      onClick={() => setShowAllComments(true)}
                    >
                      {t('all-comments.title')}
                    </button>
                  </div>
                )}
                <div className={buttonstyles.introContainer}>
                  <Link href={`/${schoolId}/teachers`}>
                    <span className={buttonstyles.seeTeachers}>{t('TeacherPage.seeteachers')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleClose} className={styles["close-button"]}><X /></button>
        </div>
        {showAllComments && (
          <div className={styles['all-comments-modal']} onClick={e => e.stopPropagation()}>
            <div className={styles['all-comments-container']}>
              <button className={styles['close-all-comments-btn']} onClick={handleCloseAllComments}>
                <X />
              </button>
              <CommentGrid
                comments={sortedComments}
                schoolName={schoolName}
                onVote={handleVote}
                onNotLogin={() => setIsSignUpModalOpen(true)}
                schoolId={schoolId}
                setComments={setComments}
                setIsSignUpModalOpen={setIsSignUpModalOpen}
                criteria={criteria}
                onReport={handleReport}
              />
            </div>
          </div>
        )}
        <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
        {ratingModalOpen && createPortal(
          <SchoolRatingModal
            schoolId={schoolId}
            isOpen={ratingModalOpen}
            onClose={() => setRatingModalOpen(false)}
            alreadyRatedDetector={alreadyRatedDetector}
          />,
          document.body
        )}
        {reportModalData && (
          <ReportModal
            isOpen={!!reportModalData}
            onClose={() => setReportModalData(null)}
            onSubmit={handleReportSubmit}
            {...reportModalData}
          />
        )}
      </div>
    </>
  );
};

export default SchoolCardDetail;