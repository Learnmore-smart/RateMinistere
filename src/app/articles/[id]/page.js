'use client';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../components/Tooltip';
import { ContentRenderer } from '../../components/ContentRenderer';
import styles from './style.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticlePage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const router = useRouter();

    const article = t(`articles.${id}`, { returnObjects: true });

    if (!article?.id) {
        router.push('/articles');
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.topText}>
                    <h3>{t('articles.topSection.text')}</h3>
                    <Link href="https://www.your-url" passHref legacyBehavior>
                        <button className={styles.tryButton}>
                            <p>{t('articles.topSection.button')}</p>
                        </button>
                    </Link>
                </div>
                <div className={styles.topImage}>
                    <Image
                        src="/rateministere/images/Rateministere.png"
                        alt="Rateministere"
                        width={400}
                        height={400}
                        style={{
                            borderRadius: '60px',
                            width: '100%',
                            height: 'auto'
                        }}
                        priority
                    />
                </div>
            </div>
            <div className={styles.fullscreenArticle}>
                <h1 className={styles.articleTitle}>{article.title}</h1>
                <p className={styles.articleDate}>{article.date}</p>
                <ContentRenderer articleId={id} />
            </div>

            {/* Bottom Container */}
            <div className={styles.bottomContainer}>
                <div className={styles.bottomContent}>
                    <h2>{t('articles.bottomSection.title')}</h2>
                    <span>{t('articles.bottomSection.text')}</span>
                    <Link href="https://www.your-url" passHref legacyBehavior>
                        <button className={styles.tryButton2}>
                            <p>{t('articles.topSection.button')}</p>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}