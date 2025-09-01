'use client';
import React from "react";
import { useTranslation } from "react-i18next";
import styles from '../AstrAlumnaGuidelines/AstrAlumnaGuidelines.module.css';
import Tooltip from '../components/Tooltip';
import { Undo2 } from 'lucide-react';

const Guidelines = () => {
  const { t } = useTranslation();

  const handleUndo = () => {
    window.history.back();
  }

  return (
    <div className={styles.container}>
      <Tooltip text="Go back">
        <button className={styles['undo-button']} onClick={handleUndo}>
          <Undo2 size={24} />
        </button>
      </Tooltip>
      <h1 className={styles.title}>{t('guidelines.title')}</h1>
      <div className={styles.intro}>
        <p>{t('guidelines.preamble')}</p>
      </div>


      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.platformPrinciples.title')}</h2>
        <h3 className={styles.subsubheading}>{t('guidelines.platformPrinciples.scopeOfParticipation.title')}</h3>
        <ul className={styles.recommendationsList}>
          <li>{t('guidelines.platformPrinciples.scopeOfParticipation.points.0')}
            <ul className={styles.recommendationsList}>
              <li>{t('guidelines.platformPrinciples.scopeOfParticipation.points.1')}</li>
              <li>{t('guidelines.platformPrinciples.scopeOfParticipation.points.2')}</li>
            </ul>
          </li>
          <li><strong style={{ color: 'red' }}>{t('guidelines.platformPrinciples.scopeOfParticipation.points.3')}</strong></li>
          <li>{t('guidelines.platformPrinciples.scopeOfParticipation.points.4')}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subsubheading}>{t('guidelines.platformPrinciples.prohibitedContent.title')}</h3>

        <h4 className={styles.subsubheading}>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.title')}</h4>
        <ul className={styles.recommendationsList}>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.0')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.1')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.2')}
            <ul className={styles.recommendationsList}>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.3')}</li>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.4')}</li>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.5')}</li>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.6')}</li>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.7')}</li>
              <li>{t('guidelines.platformPrinciples.prohibitedContent.unacceptableCommentary.points.8')}</li>
            </ul>
          </li>
        </ul>

        <h4 className={styles.subsubheading}>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.title')}</h4>
        <ul className={styles.recommendationsList}>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.0')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.1')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.2')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.3')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.4')}</li>
          <li>{t('guidelines.platformPrinciples.prohibitedContent.strictlyForbidden.points.5')}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.moderationProtocol.title')}</h2>
        <p>{t('guidelines.moderationProtocol.contentEvaluation')}</p>

        <h3 className={styles.subsubheading}>{t('guidelines.moderationProtocol.progressiveDisciplinary.title')}</h3>
        <ol className={styles.recommendationsList}>
          <li>
            <strong>{t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.0.level')}</strong>
            {t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.0.description')}
          </li>
          <li>
            <strong>{t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.1.level')}</strong>
            {t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.1.description')}
          </li>
          <li>
            <strong>{t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.2.level')}</strong>
            {t('guidelines.moderationProtocol.progressiveDisciplinary.infractions.2.description')}
          </li>
        </ol>

        <p>{t('guidelines.moderationProtocol.reviewMechanism')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.constructiveFeedback.title')}</h2>
        <h3 className={styles.subsubheading}>{t('guidelines.constructiveFeedback.acceptableCommentary.title')}</h3>
        <ul className={styles.recommendationsList}>
          <li>{t('guidelines.constructiveFeedback.acceptableCommentary.points.0')}</li>
          <li>{t('guidelines.constructiveFeedback.acceptableCommentary.points.1')}</li>
          <li>{t('guidelines.constructiveFeedback.acceptableCommentary.points.2')}</li>
          <li>{t('guidelines.constructiveFeedback.acceptableCommentary.points.3')}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.consequences.title')}</h2>
        <p>{t('guidelines.consequences.content')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.legalReservation.title')}</h2>
        <p>{t('guidelines.legalReservation.content')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>{t('guidelines.disclaimer.title')}</h2>
        <p>{t('guidelines.disclaimer.content')}</p>
      </div>

    </div>
  );
};

export default Guidelines;