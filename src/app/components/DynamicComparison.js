'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DynamicComparison.module.css';
import { Check, X } from '@phosphor-icons/react';

export const DynamicComparison = ({ comparisonId }) => {
    const { t } = useTranslation();
    const comparison = t(`articles.${comparisonId}.comparison`, { returnObjects: true });

    if (!comparison || !comparison.sections) return null;

    const numPlatforms = comparison.platforms.length;

    return (
        <div className={styles.bigContainer}>
            <div className={styles.container}>
                {/* Comparison Table */}
                <div
                    className={styles.gridContainer}
                    style={{ gridTemplateColumns: `repeat(${numPlatforms + 1}, 1fr)` }}
                >
                    {/* Header Row (Sticky) */}
                    <div className={`${styles.gridItem} ${styles.header} ${styles.stickyHeader} ${styles.headerRow}`}>
                        {t('comparison.feature')}
                    </div>
                    {comparison.platforms.map((platform, index) => (
                        <div
                            key={index}
                            className={`${styles.gridItem} ${styles.header} ${styles.stickyHeader} ${styles.headerRow}`}
                        >
                            <span>{platform}</span>
                        </div>
                    ))}

                    {/* Feature Rows */}
                    {comparison.sections.map((section) => (
                        section.features.map((feature, featureIndex) => (
                            <React.Fragment key={featureIndex}>
                                {/* Feature Label (Sticky) */}
                                <div className={`${styles.gridItem} ${styles.featureLabel} ${styles.stickyColumn}`}>
                                    <span>{feature.label}</span>
                                    {feature.description && (
                                        <div className={styles.featureDescription}>
                                            <span>{feature.description}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Availability Cells */}
                                {comparison.platforms.map((_, platformIndex) => (
                                    <div
                                        key={platformIndex}
                                        className={`${styles.gridItem} ${styles.availability} ${platformIndex === 0 ? styles.rateMinistere : styles.rateMyProfessor
                                            }`}
                                    >
                                        {feature.availability[platformIndex] ? (
                                            <Check weight="bold" className={styles.available} />
                                        ) : (
                                            <X weight="bold" className={styles.notAvailable} />
                                        )}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))
                    ))}
                </div>
            </div>

            {/* Disclaimer (Outside the Grid Container) */}
            {
                comparison.disclaimer && (
                    <div className={styles.disclaimer}>*{comparison.disclaimer}</div>
                )
            }
        </div >
    );
};