'use client';
import { useTranslation } from 'react-i18next';
import { DynamicComparison } from './DynamicComparison';
import styles from './ContentRenderer.module.css';

export const ContentRenderer = ({ articleId }) => {
    const { t } = useTranslation();
    const article = t(`articles.${articleId}`, { returnObjects: true });

    return (
        <>
            {/* Article Content */}
            {article?.content && (
                <div className={styles.articleContent}>
                    {article.content.map((section, index) => {
                        switch (section.type) {
                            case 'text':
                                return (
                                    <div key={index} className={styles.articleText}>
                                        {section.value}
                                    </div>
                                );
                            case 'comparison':
                                return (
                                    <div key={index}>
                                        {article.comparison && article.comparison.intro && (
                                            <p className={styles.comparisonIntro}>{article.comparison.intro}</p>
                                        )}
                                        <DynamicComparison comparisonId={articleId} />
                                        {article.comparison && article.comparison.conclusion && (
                                            <div className={styles.conclusion}>
                                                <h2>{t('comparison.conclusionTitle')}</h2>
                                                <span>{article.comparison.conclusion}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
            )}
        </>
    );
};