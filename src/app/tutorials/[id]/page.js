'use client';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import styles from './tutorials.module.css';

const TutorialPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    // Tutorial data with screenshots
    const tutorialItems = Array.from({ length: 5 }, (_, i) => ({
        key: i + 1,
        question: t(`FAQ.questions.${i + 1}`),
        answer: t(`FAQ.answers.${i + 1}`),
        screenshots: Array.from({ length: 3 }, (_, j) => `step-${j + 1}.png`) // 3 screenshots per tutorial
    }));

    /*  public /
            images /
            tutorials /
            1 /
                step - 1.png
                step - 2.png
                step - 3.png
            2 /
                step - 1.png
                step - 2.png
                step - 3.png
            3 /...etc. */

    const item = tutorialItems.find(i => i.key === Number(id));

    if (!item) return <div>{t('general.loading')}</div>;

    return (
        <div className={styles.tutorialContainer}>
            <div className={styles.bg}></div>
            <div className={styles.tutorialContent}>
                <h1>{item.question}</h1>
                <div className={styles.tutorialBody}>
                    <p className={styles.tutorialText}>{item.answer}</p>
                    {item.screenshots && item.screenshots.length > 0 && (
                        <div className={styles.screenshotGallery}>
                            {item.screenshots.map((screenshot, index) => (
                                <div key={index} className={styles.screenshotItem}>
                                    <div className={styles.stepNumber}><span>{t("FAQ.step")} {index + 1}</span></div>
                                    <Image
                                        src={`/rateministere/images/tutorials/${id}/${screenshot}`}
                                        alt={`${item.question}-Step${index + 1}`}
                                        width={800}
                                        height={600}
                                        quality={100}
                                        className={styles.tutorialImage}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialPage;