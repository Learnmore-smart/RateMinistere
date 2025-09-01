// src/app/astrarena/page.js
"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.css';
import Tooltip from '../components/Tooltip';
import Image from 'next/image';
import Leaderboard from '../components/leaderboard/leaderboard';
import GeometricAnimation from '../components/Background/geometry/App';
import { Meteor } from "@phosphor-icons/react";
import { Gamepad2, ListChecks, Trophy, Undo2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CoursePathModal from '../components/CoursePathModal/CoursePathModal';
import {
    COURSE_OPTIONS,
    DAILY_QUESTS,
    DAILY_REWARDS,
} from './constants.js';

import { TANK_STATS } from './training/battleData.js';


const StudentCompetition = () => {
    const router = useRouter()

    const [selectedCourse, setSelectedCourse] = useState('math');
    const courseOptionsRef = useRef(null);
    const [showCourseOptions, setShowCourseOptions] = useState(false);
    const [gemCount, setGemCount] = useState(100);
    const [bulletCount, setBulletCount] = useState(5);
    const [isMobileView, setIsMobileView] = useState(false);
    const [activePage, setActivePage] = useState('battle');
    const { t } = useTranslation();
    const [showTankModal, setShowTankModal] = useState(false);
    const [showCoursePath, setShowCoursePath] = useState(false);
    const [userProgress, setUserProgress] = useState({
        currentChapter: '1.1.1', // Set default or load from storage/API
        completedQuizzes: [],
        unlockedChapters: ['1.1.1']
    });


    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 1320);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobileView) {
            const savedPage = localStorage.getItem('activePage');
            setActivePage(savedPage || 'battle');
        } else {
            setActivePage('battle');
        }
    }, [isMobileView]);

    useEffect(() => {
        localStorage.setItem('activePage', activePage);
    }, [activePage]);


    const showBattlePage = activePage === 'battle';
    const showQuestsPage = activePage === 'quests';
    const showLeaderboardPage = activePage === 'leaderboard';

    const handleNavigate = (page) => {
        setActivePage(page);
    };

    const generateQuestReward = (difficulty) => {
        const isGems = Math.random() < 0.7;
        if (isGems) {
            const gemRanges = {
                1: [5, 10],
                2: [15, 23],
                3: [27, 35],
                4: [40, 50]
            };
            const [min, max] = gemRanges[difficulty];
            return { type: 'gems', amount: Math.floor(Math.random() * (max - min + 1)) + min };
        }
        return { type: 'special_bullet', amount: difficulty };
    };

    const currentDay = 3;
    const reward = DAILY_REWARDS[currentDay].description;
    const newreward = DAILY_REWARDS[currentDay + 1].description;

    const handleClickOutside = (event) => {
        if (courseOptionsRef.current && !courseOptionsRef.current.contains(event.target)) {
            setShowCourseOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUndo = () => {
        window.history.back();
    }

    const geometricAnimationRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (geometricAnimationRef.current) {
            geometricAnimationRef.current.dispatchEvent(new MouseEvent('click', event))
        }
    }

    const handleClick = (path) => {
        router.push(path);
    };

    return (
        <>
            <GeometricAnimation ref={geometricAnimationRef} />
            <div className={styles.competitionBackground}></div>
            <div className={styles.competitionContainer} onClick={handleOverlayClick}>
                {!isMobileView && (
                    <div className={styles.leftSidebar}>
                        <Tooltip text="Go back">
                            <button className={styles['undo-button']} onClick={handleUndo}>
                                <Undo2 size={24} />
                            </button>
                        </Tooltip>
                        <div className={styles.topBar}>
                            <div className={styles.courseSelection}>
                                <button
                                    className={`${styles.toggleButton} ${showCourseOptions ? styles.toggleButtonActive : ''}`}
                                    onClick={() => setShowCourseOptions(!showCourseOptions)}
                                    onMouseEnter={() => setShowCourseOptions(true)}
                                    onMouseLeave={() => setShowCourseOptions(false)}
                                >
                                    {COURSE_OPTIONS.find(lang => lang.key === selectedCourse)?.icon}
                                    <span>{COURSE_OPTIONS.find(lang => lang.key === selectedCourse)?.name}</span>
                                </button>
                                <div ref={courseOptionsRef} className={`${styles.courseOptions} ${showCourseOptions ? styles.courseOptionsOpen : ''}`}>
                                    <div className={styles.courseOptionsContainer}>
                                        {COURSE_OPTIONS.map(lang => (
                                            <button
                                                key={lang.key}
                                                onClick={() => {
                                                    setSelectedCourse(lang.key);
                                                    setShowCourseOptions(false);
                                                }}
                                                className={selectedCourse === lang.key ? styles.activeCourse : ''}
                                            >
                                                <div className={styles.iconContainer}>{lang.icon}</div>
                                                <span className={styles.courseName}>{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.resourceContainer}>
                                <div className={styles.gems}>
                                    <Image src="https://d35aaqx5ub95lt.cloudfront.net/vendor/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="Gems" width={24} height={30} />
                                    <span>{gemCount}</span>
                                </div>
                                <div className={styles.bullets}>
                                    <Meteor size={30} color="#FF8C00" />
                                    <span>{bulletCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dailyItemsContainer}>
                            <div className={styles.dailyCheckIn}>
                                <h2>Daily Check-In</h2>
                                <div className={styles.checkInProgress}>
                                    {[...Array(7)].map((_, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.dayNode} ${index < currentDay ? styles.completed : ''} ${index === currentDay ? styles.current : ''}`}
                                        />
                                    ))}
                                </div>
                                <div className={styles.rewardPreview}>
                                    <div className={styles.todayreward}>
                                        <span>Today: {reward}<br></br></span>
                                    </div>
                                    <div className={styles.tomorrowreward}>
                                        <span>Tomorrow: {newreward}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dailyQuest}>
                                <h2>Daily Quests</h2>
                                {DAILY_QUESTS.map((quest) => (
                                    <div key={quest.id} className={styles.questContent}>
                                        <p>{quest.description}</p>
                                        <div className={styles.questProgressBar}>
                                            <div className={styles.questProgressBarFill} style={{ width: `${(quest.progress / quest.goal) * 100}%` }}></div>
                                        </div>
                                        <span className={styles.questProgressText}>{quest.progress}/{quest.goal} completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.mainContent}>
                    <p className={styles["innovation-notice"]}>
                        {t('TeacherPage.renovation')}
                    </p>
                    {activePage === 'battle' && (
                        <>
                            <div className={styles.header}>
                                <h1>AstrArena</h1>
                            </div>
                            <div className={styles.arenaContainer}>
                                <div className={styles.arenaPicture}>
                                    <Image
                                        src="/images/Arenas/Arena 1.png"
                                        alt="Arena 1"
                                        width={1024}
                                        height={1024}
                                        priority
                                    />
                                </div>
                                <button
                                    className={styles.courseSelector}
                                    onClick={() => setShowCoursePath(true)}
                                >
                                    {t('Astrarena.select_module')}
                                </button>
                            </div>
                            <div className={styles.buttonsContainer}>
                                <div className={styles.mainButtons}>
                                    <button className={styles.battleButton}>
                                        Battle
                                    </button>
                                    <button className={styles.partyButton}>
                                        Party!
                                    </button>
                                </div>
                                <div className={styles.additionalButtons}>
                                    <button className={styles.trainingButton}
                                        onClick={() => handleClick("/astrarena/training")}
                                    >
                                        Training
                                    </button>
                                    <button
                                        className={styles.tankButton}
                                        onClick={() => setShowTankModal(true)}
                                    >
                                        <Image
                                            src={'/images/Arenas/tanks/Upgrade3.2.png'}
                                            width={60}
                                            height={60}
                                            alt="Tank Image"
                                            className={styles.tankImage}
                                        />
                                    </button>
                                </div>
                            </div>
                            {showTankModal && (
                                <div className={styles.tankModalOverlay}>
                                    <div className={styles.tankModalContent}>
                                        <button
                                            className={styles.closeButton}
                                            onClick={() => setShowTankModal(false)}
                                        >
                                            <X size={24} />
                                        </button>
                                        <h2>Astrers</h2>
                                        <div className={styles.tankGrid}>
                                            {Object.keys(TANK_STATS).map((tankKey) => {
                                                const tank = TANK_STATS[tankKey];
                                                const imagePath = `/images/Arenas/tanks/Upgrade${tankKey}.png`;

                                                return (
                                                    <div key={tankKey} className={styles.tankCard}>
                                                        <Image
                                                            src={imagePath}
                                                            alt={tank.name}
                                                            className={styles.tanksimage}
                                                            width={300}
                                                            height={300}
                                                        />
                                                        <h3>{tank.name} Tank</h3>

                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className={styles.chestsContainer}>
                                <div className={styles.chest}>Chest 1</div>
                                <div className={styles.chest}>Chest 2</div>
                                <div className={styles.chest}>Chest 3</div>
                                <div className={styles.chest}>Chest 4</div>
                            </div>
                        </>
                    )}

                    {activePage === 'quests' && (
                        <div className={styles.questsPageContent}>
                            <div className={styles.header}>
                                <h1>Quests</h1>
                            </div>
                            <div className={styles.topBar}>
                                <div className={styles.courseSelection}>
                                    <button
                                        className={`${styles.toggleButton} ${showCourseOptions ? styles.toggleButtonActive : ''}`}
                                        onClick={() => setShowCourseOptions(!showCourseOptions)}
                                        onMouseEnter={() => setShowCourseOptions(true)}
                                        onMouseLeave={() => setShowCourseOptions(false)}
                                    >
                                        {COURSE_OPTIONS.find(lang => lang.key === selectedCourse)?.icon}
                                        <span>{COURSE_OPTIONS.find(lang => lang.key === selectedCourse)?.name}</span>
                                    </button>
                                    <div ref={courseOptionsRef} className={`${styles.courseOptions} ${showCourseOptions ? styles.courseOptionsOpen : ''}`}>
                                        <div className={styles.courseOptionsContainer}>
                                            {COURSE_OPTIONS.map(lang => (
                                                <button
                                                    key={lang.key}
                                                    onClick={() => {
                                                        setSelectedCourse(lang.key);
                                                        setShowCourseOptions(false);
                                                    }}
                                                    className={selectedCourse === lang.key ? styles.activeCourse : ''}
                                                >
                                                    <div className={styles.iconContainer}>{lang.icon}</div>
                                                    <span className={styles.courseName}>{lang.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.resourceContainer}>
                                    <div className={styles.gems}>
                                        <Image src="https://d35aaqx5ub95lt.cloudfront.net/vendor/45c14e05be9c1af1d7d0b54c6eed7eee.svg" alt="Gems" width={24} height={30} />
                                        <span>{gemCount}</span>
                                    </div>
                                    <div className={styles.bullets}>
                                        <Meteor size={30} color="#FF8C00" />
                                        <span>{bulletCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dailyItemsContainer}>
                                <div className={styles.dailyCheckIn}>
                                    <h2>Daily Check-In</h2>
                                    <div className={styles.checkInProgress}>
                                        {[...Array(7)].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.dayNode} ${index < currentDay ? styles.completed : ''} ${index === currentDay ? styles.current : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.rewardPreview}>
                                        <div className={styles.todayreward}>
                                            <span>Today: {reward}<br></br></span>
                                        </div>
                                        <div className={styles.tomorrowreward}>
                                            <span>Tomorrow: {newreward}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.dailyQuest}>
                                    <h2>Daily Quests</h2>
                                    {DAILY_QUESTS.map((quest) => (
                                        <div key={quest.id} className={styles.questContent}>
                                            <p>{quest.description}</p>
                                            <div className={styles.questProgressBar}>
                                                <div className={styles.questProgressBarFill} style={{ width: `${(quest.progress / quest.goal) * 100}%` }}></div>
                                            </div>
                                            <span className={styles.questProgressText}>{quest.progress}/{quest.goal} completed</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activePage === 'leaderboard' && (
                        <div className={styles.leaderboardPageContent}>
                            <div className={styles.header}>
                                <h1>Leaderboard</h1>
                            </div>
                            <Leaderboard />
                        </div>
                    )}
                </div>
                {!isMobileView && (
                    <div className={styles.rightSidebar}>
                        <Leaderboard />
                    </div>
                )}
            </div>
            {isMobileView && (
                <nav className={styles.bottomNavbar}>
                    <button className={`${styles.bottomNavbarButton} ${activePage === 'battle' ? styles.active : ''}`} onClick={() => handleNavigate('battle')}>
                        <Gamepad2 size={24} />
                    </button>
                    <button className={`${styles.bottomNavbarButton} ${activePage === 'quests' ? styles.active : ''}`} onClick={() => handleNavigate('quests')}>
                        <ListChecks size={24} />
                    </button>
                    <button className={`${styles.bottomNavbarButton} ${activePage === 'leaderboard' ? styles.active : ''}`} onClick={() => handleNavigate('leaderboard')}>
                        <Trophy size={24} />
                    </button>
                </nav>
            )}
            {showCoursePath && (
                <CoursePathModal
                    onClose={() => setShowCoursePath(false)}
                    userProgress={userProgress}
                />
            )}
        </>
    );
};

export default StudentCompetition;