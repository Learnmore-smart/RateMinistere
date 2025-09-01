// src/app/astrarena/training/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import InfiniteBG from '@/app/components/Background/InfiniteGrid/InfiniteBG';
import styles from './battle.module.css';
import ProgressBar from "@/app/components/ProgressBar/ProgressBar";

const BattlePage = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const [currentXP, setCurrentXP] = useState(0);
    const [currentTank, setCurrentTank] = useState("0.0");
    const [showChest, setShowChest] = useState(false); // Keep for future features
    const [chestPositions, setChestPositions] = useState([]);  //Keep for future feature
    const [currentTab, setCurrentTab] = useState('theory');
    const [question, setQuestion] = useState(null);
    const [answerInput, setAnswerInput] = useState('');
    const [showError, setShowError] = useState(false);
    const [availablePowerups, setAvailablePowerups] = useState([]); //Keep for future feature
    const [gameOver, setGameOver] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [questionsData, setQuestionsData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [theoryContent, setTheoryContent] = useState('');
    const [exampleContent, setExampleContent] = useState('');
    const selectedLessonPath = searchParams.get('path'); // Get path from query
    const [isCorrect, setIsCorrect] = useState(null);



    const handleBigQuiz = async (targetChapter) => {
        const questions = generateBigQuizQuestions(targetChapter);
        const results = await presentQuiz(questions); // Implement quiz UI
        if (results.correct >= 20) {
            unlockChapter(targetChapter);
        }
    };

    useEffect(() => {
        const generateQuestions = (lessonPath) => {
            if (!lessonPath) {
                console.error("No lesson path provided.");
                return;
            }

            const fullLessonPath = `AstrArena.lessons.${lessonPath}`;
            const lessonData = t(fullLessonPath, { returnObjects: true });


            if (!lessonData || typeof lessonData !== 'object') {
                console.error(`Lesson data missing or invalid for ${fullLessonPath}.  Check your translation file.`);
                setTotalQuestions(0);
                setQuestionsData([]);
                setQuestion(null);
                return;
            }
            const generatedQuestions = [];

            //Iterate to find the questions
            for (const quizKey in lessonData) {
                if (quizKey.startsWith('quiz_')) {
                    const quizData = lessonData[quizKey];

                    if (!quizData) {
                        console.error(`Quiz data missing for ${fullLessonPath}.${quizKey}`);
                        continue;
                    }

                    // Iterate through exercises within each quiz
                    for (const exerciseKey in quizData) {
                        if (exerciseKey.startsWith('exercise')) {
                            const exerciseData = quizData[exerciseKey];

                            if (!exerciseData || !exerciseData.question || !exerciseData.answer) {
                                console.error(`Question/answer data missing for ${fullLessonPath}.${quizKey}.${exerciseKey}`);
                                continue;
                            }

                            generatedQuestions.push({
                                question: exerciseData.question,
                                answer: exerciseData.answer,
                            });
                        }
                    }
                }
            }

            setQuestionsData(generatedQuestions);
            setTotalQuestions(generatedQuestions.length); // Corrected line
            if (generatedQuestions.length > 0) {
                setQuestion(generatedQuestions[0]);
            } else {
                setQuestion(null);
            }
        };

        if (selectedLessonPath) {
            generateQuestions(selectedLessonPath);
        }
    }, [t, selectedLessonPath]);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    const handleAnswerSubmit = () => {
        if (!question) return;

        const isAnswerCorrect = answerInput.trim().toLowerCase() === question.answer.toLowerCase();
        setIsCorrect(isAnswerCorrect); //Set if answer is correct

        if (isAnswerCorrect) {
            setCurrentXP(prevXP => prevXP + 20);
            setShowError(false);
        } else {
            setShowError(true);

        }
        setAnswerInput('');
        setQuestionsAnswered(prev => prev + 1);

        if (questionsAnswered + 1 >= totalQuestions) {
            setGameOver(true);
            setPlayerWon(isAnswerCorrect); // Win only if the last answer is correct.

        } else {
            // Move to the next question, even if the answer is wrong
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestion(questionsData[currentQuestionIndex + 1]);

        }
    };

    const handlePowerupSelection = (chestIndex) => { //Keep for future feature
        //Simplified for now
    };

    const handleGameOver = (playerWon) => {
        setGameOver(true);
        setPlayerWon(playerWon)
    }

    useEffect(() => {
        if (selectedLessonPath && question) {
            const fullLessonPath = `AstrArena.lessons.${selectedLessonPath}`;
            const lessonData = t(fullLessonPath, { returnObjects: true });

            if (lessonData && typeof lessonData === 'object') {
                let currentQuizKey = null;

                // Find the quiz key containing the current question
                for (const key in lessonData) {
                    if (key.startsWith('quiz_')) {
                        const quizData = lessonData[key];
                        for (const exerciseKey in quizData) {
                            if (exerciseKey.startsWith('exercise') && quizData[exerciseKey]?.question === question.question) {
                                currentQuizKey = key;
                                break;
                            }
                        }
                        if (currentQuizKey) break;
                    }
                }

                if (currentQuizKey) {
                    // Use optional chaining and nullish coalescing for safety
                    setTheoryContent(lessonData[currentQuizKey]?.explanation?.theory ?? '');
                    setExampleContent(lessonData[currentQuizKey]?.explanation?.example ?? '');
                } else {
                    setTheoryContent('');
                    setExampleContent('');
                }
            }
        }
    }, [selectedLessonPath, t, question]);



    return (
        <div className={styles.battleContainer}>
            <InfiniteBG />
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.ProgressBar}>
                    {/* Pass totalQuestions and onComplete to ProgressBar */}
                    <ProgressBar totalQuestions={totalQuestions} onComplete={handleGameOver} isCorrect={isCorrect} />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.questionContainer}>
                    {question && <h2 className={styles.question} style={{ color: 'white' }}>{question.question}</h2>}
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${currentTab === 'theory' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('theory')}
                        >
                            {t("theory")}
                        </button>
                        <button
                            className={`${styles.tabButton} ${currentTab === 'example' ? styles.activeTab : ''}`}
                            onClick={() => handleTabChange('example')}
                        >
                            {t("example")}
                        </button>
                    </div>
                    {question && (
                        <>
                            {currentTab === 'theory' && theoryContent && (
                                <div className={styles.tabContent} dangerouslySetInnerHTML={{ __html: theoryContent }} />
                            )}
                            {currentTab === 'example' && exampleContent && (
                                <div className={styles.tabContent} dangerouslySetInnerHTML={{ __html: exampleContent }} />
                            )}
                            <div className={styles.answerContainer}>
                                <input
                                    type="text"
                                    value={answerInput}
                                    onChange={(e) => setAnswerInput(e.target.value)}
                                    placeholder={t("enter_answer")}
                                    disabled={gameOver}

                                />
                                <button onClick={handleAnswerSubmit} disabled={gameOver}>{t("submit_answer")}</button>
                            </div>
                            {showError && (
                                <div className={styles.error}>
                                    <span>{t("error_message")}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {gameOver && (
                    <div className={styles.gameOverOverlay}>
                        <div className={styles.gameOverContainer}>
                            <h2>{t("game_over")}</h2>
                            <p>{playerWon ? t("you_won") : t("you_lost")}</p>
                            <button onClick={() => {
                                router.push('/astrarena')
                            }}>{t("go_back_astrarena")}</button>
                        </div>
                    </div>
                )}
                {/* Bottom Container  */}
                <div className={styles.bottomcontainer}>
                    <div className={styles.tankArea}>
                        <div className={styles.xpCounter}>
                            <span className={styles.xpText}>{currentXP} XP</span>
                        </div>
                        <div className={styles.tankContainer}>
                            <img src={`/images/Arenas/tanks/Upgrade${currentTank}.png`} alt="Tank" className={styles.tankImage} />
                        </div>
                    </div>
                </div>

                {/* Chest Container (Conditional Rendering) */}
                {showChest && (  //Keep for future feature
                    <div className={styles.chestContainer}>
                        {chestPositions.map((chest, index) => (
                            <div
                                key={index}
                                className={styles.chest}
                                onClick={() => handlePowerupSelection(index)}
                            >
                                <img
                                    src={`/images/Arenas/Chests/chest1.png`}
                                    alt={`Chest ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BattlePage;