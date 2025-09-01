"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Undo2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from "react-loading-skeleton";
import styles from './SchoolList.module.css';
import Link from 'next/link';

const fetchSchool = async (schoolId) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/schools?sid=${schoolId}`);
    const school = await res.json();
    return school.dbResults;
};

const SchoolListPage = () => {
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const listRef = useRef(null);
    const { t } = useTranslation();

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

    const scrollToLetter = (letter) => {
        if (listRef.current) {
            const element = listRef.current.querySelector(`[data-letter="${letter}"]`);
            if (element) {
                const navbarOffset = 140; // Adjust this value if your navbar height changes
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    };

    const getFirstLetters = () => {
        const letters = new Set();
        schools.forEach(school => {
            letters.add(school.name[0].toUpperCase());
        });
        return Array.from(letters).sort();
    };

    const firstLetters = getFirstLetters();

    const handleUndo = () => {
        window.history.back();
    }

    const handleSchoolClick = async (schoolId) => {
        const school = await fetchSchool(schoolId);
        if (school) {
            router.push(`/${schoolId}`);
        }
    };

    const handleSeeTeachersClick = (e, schoolId) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
        router.push(`/${schoolId}/teachers`);
    };

    return (
        <div className={styles.page}>
            <div className={styles.overlay}></div>
            <button className={styles.undoButton} onClick={handleUndo}>
                <Undo2 size={24} />
            </button>
            <div className={styles.listContainer} ref={listRef}>
                <div className={styles.header}>
                    <h1>{t('SearchBar.schoollist')}</h1>
                </div>
                {isLoading ? (
                    Array(5).fill().map((_, i) => (
                        <div key={i} className={styles.schoolCard}>
                            <Skeleton height={80} />
                        </div>
                    ))
                ) : (
                    schools.map((school) => (
                        <div className={styles.schoolCard}
                            onClick={() => handleSchoolClick(school.schoolId)}
                            data-letter={school.name[0].toUpperCase()}
                            key={school.schoolId} // Added key prop for list items
                        >
                            <h3>{school.name}</h3>
                            <p>{school.geolocation}</p>
                            <div className={styles.ratingContainer}>
                                <span className={styles.ratingNumber}>
                                    {school.overall === 0 || school.overall === null || school.overall === undefined ? 'N/A' : school.overall.toFixed(1)}
                                </span>
                                <span
                                    className={styles.seeTeachers}
                                    onClick={(e) => handleSeeTeachersClick(e, school.schoolId)}
                                >
                                    {t('TeacherPage.seeteachers')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div className={styles.alphabetNav}>
                    {firstLetters.map((letter) => (
                        <span
                            key={letter}
                            className={styles.alphabetLetter}
                            onClick={() => scrollToLetter(letter)}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolListPage;
