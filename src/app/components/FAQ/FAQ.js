'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretDown } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from './FAQ.module.css';
import { ArrowSquareOut } from '@phosphor-icons/react';

const FAQ = () => {
    const { t } = useTranslation();
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');

    // Generate FAQ items using nested translations
    const faqItems = Array.from({ length: 5 }, (_, i) => ({
        question: t(`FAQ.questions.${i + 1}`),
        answer: t(`FAQ.answers.${i + 1}`),
        key: i + 1,
    }));

    const filteredItems = faqItems.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenTutorial = (key) => {
        // Use window.open to open in a new tab/window
        window.open(`/tutorials/${key}`, '_blank');
    };

    const toggleExpanded = (index) => {
        setExpandedIndex(prev => prev === index ? -1 : index);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('FAQ.title')}</h1>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder={t('FAQ.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.questionsContainer}>
                {filteredItems.map((item, index) => (
                    <div key={item.key} className={styles.questionItem}>
                        <div
                            className={styles.questionHeader}
                            onClick={() => toggleExpanded(index)}
                        >
                            <h3>{item.question}</h3>
                            <CaretDown weight="bold" className={`${styles.caret} ${expandedIndex === index ? styles.caretActive : ''}`} />
                        </div>

                        {/* Conditional rendering and transition classes */}
                        <div className={`${styles.answerContent} ${expandedIndex === index ? styles.answerExpanded : styles.answerCollapsed}`}>
                            {/*Always render for smooth animation */}
                            <>
                                <p className={styles.answerText}>{item.answer}</p>
                                <button
                                    className={styles.tutorialButton}
                                    onClick={() => handleOpenTutorial(item.key)}
                                >
                                    <span className={styles.tutorialText}>{t('FAQ.tutorial')} <ArrowSquareOut weight="bold" /></span>
                                </button>
                            </>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;