// src/app/components/CoursePathModal/CoursePathModal.js
import { useState, useEffect } from 'react';
import { CaretDoubleRight } from '@phosphor-icons/react';
import styles from './CoursePathModal.module.css';
import { useTranslation } from 'react-i18next';

const CoursePathModal = ({ onClose, userProgress }) => {
    const { t } = useTranslation();
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        // Generate chapters based on user progress
        const generatedChapters = [];
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 2; j++) {
                generatedChapters.push({
                    id: `${i}.1.${j}`,
                    title: t(`chapters.${i}_1_${j}`),
                    quizzes: Array.from({ length: 8 }, (_, idx) => ({
                        number: idx + 1,
                        status: getQuizStatus(i, j, idx + 1)
                    }))
                });
            }
        }
        setChapters(generatedChapters);
    }, [userProgress]);

    const getQuizStatus = (chapterMajor, chapterMinor, quizNumber) => {
        // Implement logic based on userProgress
        return 'unlocked'; // Default for demonstration
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                {chapters.map((chapter) => (
                    <div key={chapter.id} className={styles.chapter}>
                        <div className={styles.chapterHeader}>
                            <hr />
                            <span>{chapter.title}</span>
                            <hr />
                        </div>
                        <div className={styles.quizContainer}>
                            {chapter.quizzes.map((quiz) => (
                                <div key={quiz.number} className={styles.quizNode}>
                                    <div className={`${styles.quizCircle} ${styles[quiz.status]}`}>
                                        {quiz.number}
                                        {quiz.status === 'jumpable' && <CaretDoubleRight />}
                                    </div>
                                    <div className={styles.quizActions}>
                                        {quiz.status === 'unlocked' && <button>Select</button>}
                                        {quiz.status === 'jumpable' && <button>Jump</button>}
                                        {quiz.status === 'locked' && <button disabled>Locked</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePathModal;