"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles/TeacherCard.module.css';
import TeacherCardDetail from './TeacherCardDetail';
import TeacherRatingModal from './TeacherRatingModal';
import { useTranslation } from 'react-i18next';
import { getSubjectTranslation } from '@/app/utils/subjectUtils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Medal, WarningCircle, ArrowsOutLineVertical } from '@phosphor-icons/react';

const TeacherCard = ({ teacher, schoolName, openDetail, competitionOrder, alreadyRatedDetector, sortMode, ...otherprops }) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(openDetail);
  const { t } = useTranslation();

  if (!teacher) {
    console.warn("TeacherCard received undefined teacher prop.");
    return null;
  }

  const rating = teacher.rating || 0;
  const bluePercentage = (rating / 5) * 100;
  const redPercentage = teacher.numRatings > 0 && 100 - bluePercentage || 0;

  const renderMedal = () => {
    if (teacher.currentRank === 1) {
      return <Medal weight="fill" className={styles.goldMedal} />;
    } else if (teacher.currentRank === 2) {
      return <Medal weight="fill" className={styles.silverMedal} />;
    } else if (teacher.currentRank === 3) {
      return <Medal weight="fill" className={styles.bronzeMedal} />;
    }
    return null;
  };

  const renderRankChangeIndicator = () => {
    if (sortMode === 'alphabetic' || teacher.numRatings === 0) {
      return null;
    }

    const previousRank = teacher.lastWeekRank;
    const currentRank = teacher.currentRank;

    if (!previousRank) return null;

    if (previousRank === currentRank) {
      return (
        <div className={`${styles['rank-indicator']} ${styles['rank-indicator-asc']}`}>
          <span className={`${styles['rank-number']} ${styles['stable']}`}>
            0
          </span>
          <ArrowsOutLineVertical className={`${styles['stable-arrow']} ${styles.stable}`} />
        </div>
      );
    }

    const rankChange = Math.abs(previousRank - currentRank);
    const isImprovement = currentRank < previousRank;

    if (competitionOrder === 'desc') {
      return (
        <div className={`${styles['rank-indicator']} ${styles['rank-indicator-asc']}`}>
          <span className={`${styles['rank-number']} ${styles[isImprovement ? 'success' : 'danger']}`}>
            {rankChange}
          </span>
          {isImprovement ? (
            <ArrowUp className={`${styles['up-arrow']} ${styles.success}`} />
          ) : (
            <ArrowDown className={`${styles['down-arrow']} ${styles.danger}`} />
          )}
        </div>
      );
    } else {
      return (
        <div className={`${styles['rank-indicator']} ${styles['rank-indicator-desc']}`}>
          <span className={`${styles['rank-number']} ${styles[!isImprovement ? 'danger' : 'success']}`}>
            {rankChange}
          </span>
          {!isImprovement ? (
            <ArrowUp className={`${styles['up-arrow']} ${styles.danger}`} />
          ) : (
            <ArrowDown className={`${styles['down-arrow']} ${styles.success}`} />
          )}
        </div>
      );
    }
  };

  return (
    <>
      <div
        className={styles['teacher-card']}
        onClick={() => setIsDetailModalOpen(true)}
        {...otherprops}
      >
        {renderRankChangeIndicator()}
        <button
          className={styles['voter-button']}
          onClick={(e) => {
            e.stopPropagation();
            setIsRatingModalOpen(true);
          }}
        >
          <div>
            <Image
              src="/images/Rateministere.png"
              alt="Rateministere.png"
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '9px'
              }}
              priority
            />
          </div>
        </button>
        <div className={styles['teacher-info']}>
          <h2>{teacher.name}</h2>
          <p className={styles['role']}>{getSubjectTranslation(teacher.role)}</p>
          <p className={styles['school']}>{schoolName}</p>
        </div>
        <div
          className={styles['rating-bar']}
          style={{
            '--blue-percentage': `${bluePercentage}%`,
            '--red-percentage': `${redPercentage}%`
          }}
        >
          <div className={styles['blue-bar']} style={{ width: `${bluePercentage}%` }} />
        </div>
        <p className={styles['num-ratings']}>{renderMedal()}{teacher.numRatings} {t('TeacherCard.evaluation')}</p>
      </div>

      {isRatingModalOpen && (
        <TeacherRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          teacher={teacher}
          alreadyRatedDetector={alreadyRatedDetector}
        />
      )}

      {isDetailModalOpen && (
        <TeacherCardDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          teacher={teacher}
        />
      )}
    </>
  );
}

export default TeacherCard;
