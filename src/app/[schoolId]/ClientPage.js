// ClientPage.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./school.module.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { redirect } from "next/navigation";
import SchoolRatingModal from "./SchoolRatingModal";
import SchoolCardDetail from "./SchoolCardDetail";
import { getCriteria } from "@/app/utils/schoolsubjectUtils";
import Image from "next/image";
import { createPortal } from "react-dom";
import { convertKebabCaseToCamelCase } from "../utils/stringUtils";
import FAQ from "@/app/components/FAQ/FAQ";
import { ChatTeardropText } from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import SignUpModal from "@/app/components/SignUpModal";
import '@/app/profile/ToastCustom.css';
import { X } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import ReportModal from '@/app/components/ReportModal';
import 'react-toastify/dist/ReactToastify.css';
import SchoolCommentGrid from "./SchoolCommentGrid";

const fetchSchool = async (schoolId) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`);
  const school = await res.json();
  return school.dbResults;
};

const fetchComments = async (schoolId) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schoolcomments?sid=${schoolId}`);
  const comments = await res.json();
  return comments.dbResults;
};



const AllCommentsModal = ({ schoolName, isOpen, comments, schoolId, setComments, setIsSignUpModalOpen, onVote, setIsAllCommentsModalOpen, onReport }) => {
  const handleCloseAllComments = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const allCommentsModal = document.querySelector(`.${styles['all-comments-modal']}`);
    if (allCommentsModal) {
      allCommentsModal.classList.add(styles['closing']);
      // Clear localStorage when closing All Comments
      if (comments && Array.isArray(comments)) {
        comments.forEach(comment => {
          localStorage.removeItem(`isReplying_${comment._id}`);
          localStorage.removeItem(`replyText_${comment._id}`);
        });
      }
      setTimeout(() => setIsAllCommentsModalOpen(false), 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles["all-comments-modal"]} onClick={(e) => e.stopPropagation()}>
      <div className={styles["all-comments-container"]}>
        <button className={styles["close-all-comments-btn"]} onClick={handleCloseAllComments} >
          <X />
        </button>
        <SchoolCommentGrid
          comments={comments}
          onVote={onVote}
          onNotLogin={() => setIsSignUpModalOpen(true)}
          schoolId={schoolId}
          setComments={setComments}
          school={{ name: schoolName }}
          setIsSignUpModalOpen={setIsSignUpModalOpen}
          onReport={onReport} // Add this
        />
      </div>
    </div>
  );
};


const TeacherRating = ({ params }) => {
  const schoolId = React.use(params).schoolId;
  const { t } = useTranslation();
  const [school, setSchool] = useState({});
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsByCriteria, setCommentsByCriteria] = useState({});
  const [hoveredCriteria, setHoveredCriteria] = useState(null);
  const [pertinentComments, setPertinentComments] = useState({});
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [activeCommentIndices, setActiveCommentIndices] = useState({});
  const [allCommentsIndex, setAllCommentsIndex] = useState(0);
  const [isAllCommentsModalOpen, setIsAllCommentsModalOpen] = useState(false);
  const commentIntervalRef = useRef(null);
  const allCommentsIntervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const schoolRatingCriteria = getCriteria();
  const [isMobile, setIsMobile] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const session = useSession();
  const [reportModalData, setReportModalData] = useState(null);

  // --- Scrollbar related states and refs ---
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const allCommentsContainerRef = useRef(null);

  useEffect(() => {
    const setupData = async () => {
      const fetchedSchool = await fetchSchool(schoolId); // School data is fetched here
      if (fetchedSchool == "No school found" || !fetchedSchool) {
        return redirect("/school-not-found");
      }
      setSchool(fetchedSchool);

      const com = await fetchComments(schoolId);
      setComments(com);

      if (com && com.length > 0) {
        const grouped = com.reduce((acc, comment) => {
          const criteria = comment.commentCriteria || "";
          if (criteria === "" && typeof comment.comment === "string" && comment.comment.trim() !== "") {
            if (!acc["overall"]) acc["overall"] = [];
            acc["overall"].push(comment);
          } else if (criteria) {
            if (!acc[criteria]) acc[criteria] = [];
            acc[criteria].push(comment);
          }
          return acc;
        }, {});
        setCommentsByCriteria(grouped);
      }
    };

    setupData();

    const handleResize = () => setIsMobile(window.innerWidth <= 1100);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (commentIntervalRef.current) clearInterval(commentIntervalRef.current);
      if (allCommentsIntervalRef.current) clearInterval(allCommentsIntervalRef.current);
    };
  }, [schoolId]);

  const switchComment = (index) => {
    setAllCommentsIndex(index % comments.length);
    startTimeRef.current = Date.now();
    clearInterval(allCommentsIntervalRef.current);
    allCommentsIntervalRef.current = setInterval(() => {
      setAllCommentsIndex((prev) => (prev + 1) % comments.length);
      startTimeRef.current = Date.now();
    }, 5000);
  };

  useEffect(() => {
    if (comments.length > 1) {
      allCommentsIntervalRef.current = setInterval(() => {
        setAllCommentsIndex((prev) => (prev + 1) % comments.length);
        startTimeRef.current = Date.now();
      }, 5000);
    }
    return () => {
      clearInterval(allCommentsIntervalRef.current);
    };
  }, [comments]);

  const handleCriteriaHover = (criteriaKey) => {
    setHoveredCriteria(criteriaKey);
    const criteriaComments = commentsByCriteria[criteriaKey] || [];
    const pertinent = criteriaComments
      .map((comment) => ({
        ...comment,
        pertinence: comment.upvotes * 2 + comment.downvotes,
      }))
      .sort((a, b) => b.pertinence - a.pertinence)
      .slice(0, 5);

    setPertinentComments((prev) => ({
      ...prev,
      [criteriaKey]: pertinent,
    }));

    const criteriaSortedComments = sortedComments(criteriaKey);
    if (criteriaSortedComments.length > 1 && !commentIntervalRef.current) {
      setActiveCommentIndices((prev) => ({ ...prev, [criteriaKey]: 0 }));
      commentIntervalRef.current = setInterval(() => {
        setActiveCommentIndices((prev) => ({
          ...prev,
          [criteriaKey]: (prev[criteriaKey] + 1) % criteriaSortedComments.length,
        }));
      }, 5000);
    }
  };

  const handleCriteriaClick = (criteriaKey) => {
    const criteriaComments = sortedComments(criteriaKey);
    if (criteriaComments.length > 1) {
      if (commentIntervalRef.current) {
        clearInterval(commentIntervalRef.current);
      }
      setActiveCommentIndices((prev) => ({
        ...prev,
        [criteriaKey]: (prev[criteriaKey] + 1) % criteriaComments.length,
      }));
      commentIntervalRef.current = setInterval(() => {
        setActiveCommentIndices((prev) => ({
          ...prev,
          [criteriaKey]: (prev[criteriaKey] + 1) % criteriaComments.length,
        }));
      }, 5000);
    }

    setSelectedCriteria({
      key: criteriaKey,
      name: schoolRatingCriteria.find(
        (c) => c.key.toLowerCase() === criteriaKey
      )?.name,
      icon: schoolRatingCriteria.find(
        (c) => c.key.toLowerCase() === criteriaKey
      )?.icon,
      rating:
        school[convertKebabCaseToCamelCase(criteriaKey)]?.toFixed(1) || "N/A",
      comments: criteriaComments,
    });
    setIsCriteriaModalOpen(true);
  };

  const handleCriteriaLeave = (criteriaKey) => {
    setHoveredCriteria(null);
    if (commentIntervalRef.current) {
      clearInterval(commentIntervalRef.current);
    }
  };

  const sortedComments = (criteria) => {
    return commentsByCriteria[criteria]?.sort((a, b) => b.upvotes - a.upvotes) || [];
  };

  const formatOverallRating = (rating) => {
    if (rating === undefined || rating === null) {
      return "N/A";
    }
    const numericRating = Number(rating);
    if (isNaN(numericRating)) {
      return "N/A";
    }
    return numericRating.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    });
  };

  const alreadyRatedDetector = (accountId) => {
    if (!comments || !Array.isArray(comments)) {
      return false;
    }
    return comments.some((comment) => comment && comment.accountId.toString() === accountId.toString());
  };

  useEffect(() => {
    if (comments.length > 0) {
      const percentagePerComment = 100 / comments.length;
      const newScrollPercentage = percentagePerComment * (allCommentsIndex + 1);
      setScrollPercentage(newScrollPercentage);
    }
  }, [allCommentsIndex, comments.length]);

  const handleVote = async (commentId, voteType) => { //Define it, and pass it down.
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
        toast.error(
          <div>
            {t("Error.ratings.teachers")}
          </div>, {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }); return;
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
        toast.success(
          <div>
            {t("votes.success")}
          </div>, {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
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
      });
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
          schoolName: school.name,
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

  const sortedAllComments = comments
    ? [...comments].filter(item => item.comment?.trim()).sort((a, b) => {
      const aPertinence = (a.votes.filter(v => v.upVote).length * 2) - a.votes.filter(v => !v.upVote).length;
      const bPertinence = (b.votes.filter(v => v.upVote).length * 2) - b.votes.filter(v => !v.upVote).length;
      return bPertinence - aPertinence;
    })
    : [];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.schoolName}>{school.name}</h1>
      </div>
      <div className={styles.schoolLocation}>
        <span>{school.geolocation}</span>
      </div>
      <div className={styles.introContainer}>
        <Link href={`${schoolId}/teachers`}>
          <span className={styles.seeTeachers}>{t("TeacherPage.seeteachers")}</span>
        </Link>
      </div>
      <div className={styles.contentWrapper}>
        {!isMobile && (
          <div className={styles.overallRatingContainer}>
            <div className={styles.overallRating}>
              {formatOverallRating(school.overall)}
            </div>
            <p>{t("TeacherCardDetail.totalRating", { numRatings: school.numRatings })}</p>
          </div>
        )}
        <div className={styles.ratingsAndCommentsContainer}>
          <div className={styles.ratingsContainer}>
            {isMobile && (
              <div className={styles.overallRatingContainer}>
                <div className={styles.overallRating}>
                  {formatOverallRating(school.overall)}
                </div>
                <p>{t("TeacherCardDetail.totalRating", { numRatings: school.numRatings })}</p>
              </div>
            )}
            {schoolRatingCriteria.map((criteria) => {
              if (criteria.key === "Overall") return null;
              const criteriaKey = criteria.key.toLowerCase();
              const rating =
                school && school[convertKebabCaseToCamelCase(criteriaKey)]
                  ? school[convertKebabCaseToCamelCase(criteriaKey)].toFixed(1)
                  : "N/A";
              const criteriaComments = sortedComments(criteriaKey);
              const ratingPercentage = (rating / 5) * 100;
              const activeIndex = activeCommentIndices[criteriaKey] || 0;
              return (
                <div
                  key={criteria.key}
                  className={styles.ratingBox}
                  onMouseEnter={() => handleCriteriaHover(criteriaKey)}
                  onMouseLeave={() => handleCriteriaLeave(criteriaKey)}
                  onClick={() => handleCriteriaClick(criteriaKey)}
                  style={{ "--criteria-rating-width": `${ratingPercentage}%` }}
                >
                  <button
                    className={styles["voter-button"]}
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
                          objectFit: "cover",
                          borderRadius: "9px",
                        }}
                        priority
                      />
                    </div>
                  </button>
                  <div className={styles.ratingContentWrapper}>
                    <div className={styles.ratingContent}>
                      <div className={styles.criteriaIcon}>{criteria.icon}</div>
                      <h3 className={styles.criteriaName}>{criteria.name}</h3>
                      <div className={styles.ratingNumber}>{formatOverallRating(rating)}</div>
                    </div>
                    <div className={styles.commentsContainer}>
                      <div className={styles.blurBackground}></div>
                      {criteriaComments.length > 0 ? (
                        <div
                          key={activeIndex}
                          className={`${styles.comment} ${styles.fadeInOut}`}
                        >
                          {criteriaComments[activeIndex].comment}
                        </div>
                      ) : (
                        <div className={styles.noComments}>
                          {t("SchoolRatingModal.noComments")}
                        </div>
                      )}
                      <div className={styles.dotsContainer}>
                        {pertinentComments[criteriaKey]?.map((_, index) => (
                          <div
                            key={index}
                            className={`${styles.dot} ${pertinentComments[criteriaKey].length === 1 ||
                              activeCommentIndices[criteriaKey] === index
                              ? styles.activeDot
                              : ""
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={styles.allCommentsContainer}
        onClick={() => switchComment(allCommentsIndex + 1)}
        ref={allCommentsContainerRef}
      >
        <div className={styles["seeAllCommentsContainer"]}>
          <Tooltip text={t('SchoolRatingModal.seeAllComments')}>
            <button
              className={styles["see-all-comments-btn"]}
              onClick={(e) => {
                e.stopPropagation();
                setIsAllCommentsModalOpen(true);
              }}
            >
              <ChatTeardropText />
            </button>
          </Tooltip>
        </div>
        <h3 className={styles.allCommentsTitle}>{t("SchoolRatingModal.allComments")}</h3>
        <div className={styles.commentsPreview}>
          {comments.length > 0 && comments[allCommentsIndex] ? (
            <div
              key={comments[allCommentsIndex]._id}
              className={`${styles.comment} ${styles.fadeInOut}`}
            >
              {comments[allCommentsIndex].comment}
            </div>
          ) : (
            <div className={styles.noComments}>
              <p>{t("SchoolRatingModal.noCommentsAvailable")}</p>
            </div>
          )}
        </div>
        <div className={styles.scrollbarContainer}>
          <div
            className={styles.scrollbarTrack}
            style={{ width: comments.length > 0 ? "100%" : "0%" }}
          >
            <div
              className={styles.scrollbarThumb}
              style={{ width: `${scrollPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      {ratingModalOpen &&
        createPortal(
          <SchoolRatingModal
            schoolId={schoolId}
            schoolName={school.name} // Add this prop
            isOpen={ratingModalOpen}
            onClose={() => setRatingModalOpen(false)}
            alreadyRatedDetector={alreadyRatedDetector}
          />,
          document.body
        )}

      {isCriteriaModalOpen &&
        selectedCriteria &&
        createPortal(
          <SchoolCardDetail
            isOpen={isCriteriaModalOpen}
            onClose={() => setIsCriteriaModalOpen(false)}
            criteria={selectedCriteria}
            comments={selectedCriteria.comments}
            schoolId={schoolId}
            schoolName={school.name}
            onReport={handleReport} // Add this
          />,
          document.body
        )}
      {isAllCommentsModalOpen &&
        createPortal(
          <AllCommentsModal
            isOpen={isAllCommentsModalOpen}
            setIsAllCommentsModalOpen={setIsAllCommentsModalOpen}
            onClose={() => setIsAllCommentsModalOpen(false)}
            comments={sortedAllComments}
            schoolId={schoolId}
            schoolName={school.name}
            setComments={setComments}
            setIsSignUpModalOpen={setIsSignUpModalOpen}
            onVote={handleVote}
            onReport={handleReport} // Add this
          />,
          document.body
        )}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnBottom={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
      <FAQ />
      {reportModalData && (
        <ReportModal
          isOpen={!!reportModalData}
          onClose={() => setReportModalData(null)}
          onSubmit={handleReportSubmit}
          {...reportModalData}
        />
      )}
    </div>
  );
};

export default TeacherRating;