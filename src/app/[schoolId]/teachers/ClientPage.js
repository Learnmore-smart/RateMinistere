"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from './teachers.module.css';
import teacherCardStyles from './styles/TeacherCard.module.css';
import TeacherCard from './TeacherCard';
import { useRouter } from 'next/navigation'
import { getSubjects } from "@/app/utils/subjectUtils";
import { useTranslation } from "react-i18next";
import { objectToFormattedString } from "@/app/utils/stringUtils";
import { useSession } from "next-auth/react";
import SignUpModal from "@/app/components/SignUpModal";
import { FaDiscord } from 'react-icons/fa';
import { ListPlus, Plus, Question } from '@phosphor-icons/react';  // Import Question icon
import Skeleton from "react-loading-skeleton";
import { X, LoaderCircle, AArrowDown, AArrowUp, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/profile/ToastCustom.css';
import FAQ from '../../components/FAQ/FAQ';
import Link from "next/link";

const fetchSchool = async (schoolId) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`)
  const school = await res.json()
  return school.dbResults
}

const TeacherRating = ({ params }) => {
  const session = useSession({
    required: false
  })
  const { t } = useTranslation();
  const subjectList = getSubjects();
  const router = useRouter()
  const schoolId = React.use(params).schoolId;
  const [schoolName, setSchoolName] = useState('');
  const [alreadyRatedTeachers, setAlreadyRatedTeachers] = useState([])
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isFeatureClosing, setIsFeatureClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeature, setNewFeature] = useState({
    category: "",
    title: "",
    description: "",
  });
  const [schools, setSchools] = useState([]);
  const [isSubmittingTeacher, setIsSubmittingTeacher] = useState(false);
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [isScoreMeaningModalOpen, setIsScoreMeaningModalOpen] = useState(false); // State for score meaning modal
  const [isScoreMeaningModalClosing, setIsScoreMeaningModalClosing] = useState(false);


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools');
        const data = await response.json();
        const sortedSchools = (data.dbResults || []).sort((a, b) => a.name.localeCompare(b.name));
        setSchools(sortedSchools);
      } catch (err) {
        console.error('Error fetching schools:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSubmitFeature = async (e) => {
    e.preventDefault();
    setIsSubmittingFeature(true);

    try {
      const response = await fetch('https://discord.com/api/webhooks/1334735672438685797/BNaoPYhCIFfJStK6vtNRMAPp8lzk6yD7raiw2Y7cYeUaSXVfXp30lWTezB9huzZrOqxi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: objectToFormattedString({
            "prompter username": session.data.user.name,
            "prompter email": session.data.user.email,
            ...newFeature,
          })
        })
      });

      if (response.ok) {
        toast.success(t('FeaturePage.featureSubmitted'));

        setNewFeature({ //Reset only on success
          category: "",
          title: "",
          description: "",
        });
      } else {
        toast.error(t('Common.errorTryAgain'));
      }
    } catch (error) {
      console.error('Error sending feature:', error);
      toast.error(error.message || t('Common.connectionError'));
    } finally {
      setIsSubmittingTeacher(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 300);    }
  };

  const handleFeatureInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeature(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseFeature = () => {
    handleButtonClick(() => {
      setIsFeatureClosing(true);
      setTimeout(() => {
        setIsFeatureModalOpen(false);
        setIsFeatureClosing(false);
      }, 300);
    });
  };

  const handleCloseScoreMeaning = () => {
    setIsScoreMeaningModalClosing(true); // Set closing state
    setTimeout(() => {
      setIsScoreMeaningModalOpen(false);
      setIsScoreMeaningModalClosing(false); // Reset closing state
    }, 300); // Match CSS animation duration
  };

  const fetchTeachers = async () => {
    const res = await fetch(`/api/teachers?sid=${schoolId}`);
    const teachers = await res.json();
    return teachers.dbResults;
  }

  const fetchComments = async () => {
    if (session.status !== 'authenticated') return;

    try {
      const res = await fetch(`/api/comments?aid=${session?.data?.user?.id}`);
      if (!res.ok) {
        console.error(`Failed to fetch comments: ${res.status} - ${res.statusText}`);
        return [];
      }
      const data = await res.json();
      if (!data || !data.dbResults) {
        console.error("Invalid data structure (dbResults does not exist)", data);
        return [];
      }

      if (!Array.isArray(data.dbResults)) {
        console.error("Invalid data structure (dbResults is not an array)", data);
        return [];
      }

      return data.dbResults;
    } catch (error) {
      console.error("Error in fetchComments:", error);
      return [];
    }
  };

  function alreadyRatedDetector(teacherId) {
    if (alreadyRatedTeachers.length > 0) {
      return alreadyRatedTeachers.includes(teacherId);
    }

    return false
  }

  const [sortMode, setSortMode] = useState('alphabetic'); // 'alphabetic' or 'competition'
  const [alphabeticOrder, setAlphabeticOrder] = useState('asc'); // 'asc' or 'desc'
  const [competitionOrder, setCompetitionOrder] = useState('desc'); // New state for competition order

  const sortTeachers = (teachersList) => {
    if (sortMode === 'alphabetic') {
      return teachersList.sort((a, b) =>
        alphabeticOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (sortMode === 'competition') {
      const sortedTeachers = teachersList.sort((a, b) => {
        // Always put teachers with no ratings at the bottom
        if (a.numRatings === 0 && b.numRatings > 0) return 1;
        if (b.numRatings === 0 && a.numRatings > 0) return -1;
        if (a.numRatings === 0 && b.numRatings === 0) return 0;

        // Handle cases where currentRank might be null or undefined
        const rankA = a.currentRank === null || a.currentRank === undefined ? Infinity : a.currentRank;
        const rankB = b.currentRank === null || b.currentRank === undefined ? Infinity : b.currentRank;

        const orderMultiplier = competitionOrder === 'desc' ? 1 : -1;

        // Sort in ascending or descending order based on competitionOrder
        return orderMultiplier * (rankA - rankB);
      });

      return sortedTeachers;
    }
    return teachersList;
  };

  const toggleSortMode = () => {
    handleButtonClick(() => setSortMode(prev => prev === 'alphabetic' ? 'competition' : 'alphabetic'));
  };

  const toggleAlphabeticOrder = () => {
    handleButtonClick(() => setAlphabeticOrder(prev => prev === 'asc' ? 'desc' : 'asc'));
  };

  const toggleCompetitionOrder = () => {
    handleButtonClick(() => setCompetitionOrder(prev => prev === 'desc' ? 'asc' : 'desc'));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [teachers, setTeachers] = useState("loading");
  const [baseTeachers, setBaseTeachers] = useState([]);

  useEffect(() => {
    fetchSchool(schoolId).then((fetchedSchool) => {
      if (fetchedSchool == 'No school found' || !fetchedSchool) {
        return router.push('/school-not-found');
      }
      setSchoolName(fetchedSchool.name);

      fetchTeachers().then((fetchedTeachers) => {
        if (fetchedTeachers !== 'No school found' && fetchedTeachers) {
          setBaseTeachers(fetchedTeachers); // Store the unmodified teacher list
          setTeachers(fetchedTeachers); // Initialize sorted list
        } else {
          setTeachers("NONE");
        }
      });
    });
  }, [schoolId]);

  // Effect to sort teachers when sorting states change
  useEffect(() => {
    if (Array.isArray(baseTeachers)) {
      const sorted = sortTeachers([...baseTeachers]); // Sort a copy of the base list
      setTeachers(sorted);
    }
  }, [sortMode, alphabeticOrder, competitionOrder, baseTeachers]); // Trigger sorting on state changes

  useEffect(() => {
    fetchComments().then(comments => {
      const arrayOfAlreadyRatedTeachers = comments && comments.length > 0 && comments.map(item => {
        if (item && typeof item === 'object' && item.hasOwnProperty('teacherId')) {
          return item.teacherId;
        } else {
          return null;
        }
      }).filter(id => id !== null); // Remove null values (items without valid 'teacherId')

      setAlreadyRatedTeachers(arrayOfAlreadyRatedTeachers)
    })
  }, [session?.data?.user?.email])

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    role: "",
    secondRole: "", // Add second role field
    school: "",
    rating: "",
    numRatings: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTeacher(true);

    try {
      const response = await fetch('https://discord.com/api/webhooks/1314368705613922334/6NN81ozSYehOdclyi2bzBNeFXrNLSP8qcbgOG4qWMdeanVh9LQB9LMTiRgJLG8gmCT_k', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: objectToFormattedString({
            "prompter username": session.data.user.name,
            "prompter email": session.data.user.email,
            ...newTeacher,
          })
        })
      });

      if (response.ok) {
        toast.success(t('TeacherPage.teacherAdded'));
        setNewTeacher({
          name: "",
          role: "",
          secondRole: "",
          school: "",
          rating: "",
          numRatings: 0,
        });
      } else {
        toast.error(t('Common.errorTryAgain'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.message || t('Common.connectionError'));
    } finally {
      setIsSubmittingTeacher(false);
      setIsModalOpen(false); // Close the modal regardless of the outcome
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const firstSubjectList = [...subjectList].filter(subject => subject !== "None");
  const secondSubjectList = ["None", ...firstSubjectList];

  const handleClose = () => {
    handleButtonClick(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
      }, 300);
    })
  };

  const handleButtonClick = (action) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
    action();
  };

  const teacherCount = Array.isArray(baseTeachers) ? baseTeachers.length : 0;
  const totalEvaluations = Array.isArray(baseTeachers)
    ? baseTeachers.reduce((acc, teacher) => acc + teacher.numRatings, 0)
    : 0;

  return (
    <>
      {sortMode === 'competition' && (
        <>
          <div className={styles['competition-mode-background']}></div>
          <div className={styles['competition-mode-owl-png']}></div>
        </>
      )}
      <div className={styles["teacher-container"]}>
        <div className={`${styles.header} ${styles[sortMode]}`}>
          <h1>{t('TeacherPage.teacherRatings', { schoolName })}</h1>
          <p>{t('TeacherPage.evaluations', { count: totalEvaluations, teachers: teacherCount })}</p>
        </div>
        <div className={styles["button-group"]}>
          <button
            onClick={() => handleButtonClick(() => setIsModalOpen(true))}
            className={styles["add-button"]}
          >
            <Plus size={24} weight="bold" />
            <p>{t('AdminPage.addTeacher')}</p>
          </button>
          <button
            onClick={() => handleButtonClick(() => setIsFeatureModalOpen(true))}
            className={styles["feature-button"]}
          >
            <ListPlus size={24} weight="bold" />
            <p>{t('FeaturePage.suggestFeature')}</p>
          </button>
          <Link href={`/${schoolId}`}>
            <span className={styles.seeSchool}>{t('TeacherPage.seeschool')}</span>
          </Link>
          {/* Score Meaning Button */}
          <button
            onClick={() => handleButtonClick(() => setIsScoreMeaningModalOpen(true))}
            className={styles["score-meaning-button"]}
          >
            <Question size={30} weight="duotone" />
          </button>
        </div>
        {isScoreMeaningModalOpen && (
          <div className={`${styles["modal-overlay"]} ${isScoreMeaningModalClosing ? styles.closing : ''}`}>
            <div className={`${styles["modal-2"]} ${isScoreMeaningModalClosing ? styles.closing : ''}`}>
              <div className={styles["modal-header"]}>
                <h2>{t('TeacherPage.scoreMeaningTitle')}</h2>
                <button onClick={handleCloseScoreMeaning} className={styles["close-button"]}>
                  <X />
                </button>
              </div>
              <div className={styles["score-meaning-content"]}>
                {[
                  { range: "1-2", label: t('TeacherPage.scoreMeanings.1'), percentage: 2 / 5 },
                  { range: "2-3", label: t('TeacherPage.scoreMeanings.2'), percentage: 3 / 5 },
                  { range: "3-4", label: t('TeacherPage.scoreMeanings.3'), percentage: 4 / 5 },
                  { range: "4-5", label: t('TeacherPage.scoreMeanings.4'), percentage: 5 / 5 },
                ].map((item) => (
                  <div key={item.range} className={styles["score-meaning-row"]}>
                    <span className={styles["score-meaning-range"]}>{item.range}</span>
                    <div className={styles["score-meaning-bar-container"]}>
                      <div
                        className={styles["score-meaning-bar"]}
                        style={{ '--criteria-rating-width': `${item.percentage * 100}%` }}
                      />
                    </div>
                    <div className={styles["score-meaning-labels-container"]}> {/* Container for labels */}
                      <span className={styles["score-meaning-label"]}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(isModalOpen && session.status == "authenticated") ? (
          <div className={`${styles["modal-overlay"]} ${isClosing ? styles.closing : ''}`}>
            <div className={`${styles["modal"]} ${isClosing ? styles.closing : ''}`}>
              <div className={styles["modal-header"]}>
                <h2>{t('TeacherPage.addTeacher')}</h2>
                <button onClick={handleClose} className={styles["close-button"]}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={styles["form-group"]}>
                  <label>{t('TeacherPage.name')}:</label>
                  <input
                    type="text"
                    name="name"
                    value={newTeacher.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>{t('AdminPage.selectSubject')}:</label>
                  <select
                    name="role"
                    value={newTeacher.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('TeacherPage.selectSubject')}</option>
                    {firstSubjectList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["form-group"]}>
                  <label>{t('TeacherPage.secondSubjectOptional')}:</label>
                  <select
                    name="secondRole"
                    value={newTeacher.secondRole}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('TeacherPage.selectSubjectOptional')}</option>
                    {secondSubjectList.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["form-group"]}>
                  <label>{t('TeacherPage.school')}:</label>
                  <input
                    type="text"
                    name="school"
                    value={newTeacher.school}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles["message-container"]}>
                  <div className={styles["discord-message"]}>
                    <a
                      href="https://discord.gg/zaDJtKkuVG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.discordLink}
                    >
                      <FaDiscord className={styles.discordIcon} />
                      <span>{t('Common.DiscordIT')}</span>
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles["submit-button"]}
                  disabled={isSubmittingTeacher}
                >
                  {isSubmittingTeacher ? (
                    <div className={styles.loadingContainer}>
                      <LoaderCircle className={styles.spinner} size={20} />
                    </div>
                  ) : (
                    <p>{t('TeacherPage.addNow')}</p>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
        {(isFeatureModalOpen && session.status == "authenticated") ? (
          <div className={`${styles["modal-overlay"]} ${isFeatureClosing ? styles.closing : ''}`}>
            <div className={`${styles["modal"]} ${isFeatureClosing ? styles.closing : ''}`}>
              <div className={styles["modal-header"]}>
                <h2>{t('FeaturePage.suggestFeature')}</h2>
                <button onClick={handleCloseFeature} className={styles["close-button"]}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleSubmitFeature}>
                <div className={styles["form-group"]}>
                  <label>{t('FeaturePage.category')}:</label>
                  <select
                    name="category"
                    value={newFeature.category}
                    onChange={handleFeatureInputChange}
                    required
                  >
                    <option value="">{t('FeaturePage.selectCategory')}</option>
                    <option value="UI Improvement">{t('FeaturePage.uiImprovement')}</option>
                    <option value="New Feature">{t('FeaturePage.newFeature')}</option>
                    <option value="Bug Report">{t('FeaturePage.bugReport')}</option>
                    <option value="Other">{t('FeaturePage.other')}</option>
                  </select>
                </div>
                <div className={styles["form-group"]}>
                  <label>{t('FeaturePage.title')}:</label>
                  <input
                    type="text"
                    name="title"
                    value={newFeature.title}
                    onChange={handleFeatureInputChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>{t('FeaturePage.description')}:</label>
                  <textarea
                    name="description"
                    value={newFeature.description}
                    onChange={handleFeatureInputChange}
                    required
                    rows="4"
                  />
                </div>
                <div className={styles["message-container"]}>
                  <div className={styles["discord-message"]}>
                    <a
                      href="https://discord.gg/zaDJtKkuVG"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.discordLink}
                    >
                      <FaDiscord className={styles.discordIcon} />
                      <span>{t('Common.DiscordIT')}</span>
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles["submit-button"]}
                  disabled={isSubmittingFeature}
                >
                  {isSubmittingFeature ? (
                    <div className={styles.loadingContainer}>
                      <LoaderCircle className={styles.spinner} size={20} />
                    </div>
                  ) : (
                    <p>{t('FeaturePage.submitSuggestion')}</p>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <SignUpModal isOpen={isFeatureModalOpen} onClose={() => setIsFeatureModalOpen(false)} />
        )}
        <div className={styles["sorting-controls"]}>
          <div className={styles["sort-toggle-container"]}>
            <button
              className={`${styles["sort-toggle-button"]}
        ${sortMode === 'alphabetic' ? styles['active'] : ''}
        ${sortMode === 'competition' ? styles['competition'] : ''}`}
              onClick={toggleSortMode}
            >
              {sortMode === 'alphabetic' ? t("TeacherPage.order.alphabetic") : t("TeacherPage.order.competition")}
            </button>

            {sortMode === 'alphabetic' && (
              <>
                <div className={styles['alphabetic-mode-background']}></div>
                <div className={styles['alphabetic-mode-owl-png']}></div>
                <button
                  className={styles["order-toggle-button"]}
                  onClick={toggleAlphabeticOrder}
                >
                  {alphabeticOrder === 'asc' ? <AArrowDown /> : <AArrowUp />}
                </button>
              </>
            )}
            {sortMode === 'competition' && (
              <button
                className={styles["order-toggle-button-competition"]}
                onClick={toggleCompetitionOrder}
              >
                {competitionOrder === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
              </button>
            )}
          </div>
        </div>
        <div className={styles["teacher-list"]}>
          {teachers ? (
            <>
              {teachers == "loading" ?? (
                <div className={teacherCardStyles["teacher-card"]}>
                  <Skeleton />
                </div>
              )}
              {Array.isArray(teachers)
                ? teachers?.map((teacher) => (
                  <TeacherCard
                    key={teacher._id}
                    teacher={teacher}
                    schoolName={schoolName}
                    id={teacher._id}
                    openDetail={window.location.hash.substring(1) == teacher._id}
                    competitionOrder={competitionOrder}
                    alreadyRatedDetector={alreadyRatedDetector}
                    sortMode={sortMode}
                  />
                ))
                : <div>{t('TeacherPage.noTeachersFound')}</div>
              }
            </>
          ) : (
            <div>{t('TeacherPage.noTeachersFound')}</div>
          )}
        </div>
        <FAQ />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        limit={1}
      />
    </>
  );
};

export default TeacherRating;