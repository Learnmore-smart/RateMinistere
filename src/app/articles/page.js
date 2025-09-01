'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './articles.module.css';
import { ArrowRight } from '@phosphor-icons/react';
import Tooltip from '../components/Tooltip';
import {useRouter } from 'next/navigation';
import { Undo2 } from 'lucide-react';


export default function ArticlesPage() {
    const { t } = useTranslation();
    const articles = t('articles', { returnObjects: true });
    const router = useRouter();

    const validArticles = Object.values(articles).filter(article => article && article.id);


    return (
        <div className={styles.container}>
            <Tooltip text={t('go_back')}>
                <button
                    className={styles["undo-button"]}
                    onClick={() => router.back()}
                >
                    <Undo2 size={24} />
                </button>
            </Tooltip>
            <h1 className={styles.pageTitle}>{t('articles.title')}</h1>
            <div className={styles.greenBg}></div>
            <div className={styles.grid}>
                {validArticles.map((article) => (
                    <Link
                        key={article.id} // Ensure you have a unique key
                        href={`/articles/${article.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.card}
                    >
                        <div className={styles.cardContent}>
                            <span className={styles.date}>{article.date}</span>
                            <h3 className={styles.title}>{article.title}</h3>
                            <p className={styles.excerpt}>{article.excerpt}</p>
                            <span className={styles.readMore}>{t('read.more')}<ArrowRight /></span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}