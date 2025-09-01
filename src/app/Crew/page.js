/* "use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './crew.module.css';

export default function CrewPage() {
  const { t } = useTranslation();
  const [hoveredMember, setHoveredMember] = useState(null);

  const crewMembers = [
    {
      name: 'Noah Zixin Zhang',
      images: {
        funny: '/images/Crew/Noah/Noah-baby.jpg',
        serious: '/images/Crew/Noah/Noah-Mexico.jpg',
      },
      translations: {
        funny: t('Crew.Noah.funny'),
        serious: t('Crew.Noah.serious'),
      },
    },
    {
      name: 'Kendrick Nguyen',
      images: {
        funny: '/images/Crew/Kendrick/Kendrick-home.jpg',
        serious: '/images/Crew/Kendrick/Kendrick-school-cropped.jpeg',
      },
      translations: {
        funny: t('Crew.Kendrick.funny'),
        serious: t('Crew.Kendrick.serious'),
      },
    },
  ];

  return (
    <div className={styles.crewContainer}>
      <div className={styles.background}></div>
      <h1 className={styles.crewTitle}>{t("Crew.title")}</h1>
      <div className={styles.memberList}>
        {crewMembers.map((member) => (
          <div
            key={member.name}
            className={styles.member}
            onMouseEnter={() => setHoveredMember(member.name)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            <div className={styles.member2}>
              <div className={styles.imageContainer}>
                <img
                  src={
                    hoveredMember === member.name
                      ? member.images.serious
                      : member.images.funny
                  }
                  alt={member.name}
                  className={styles.memberImage}
                />
              </div>
              <div className={styles.memberContainer}>
                <p className={styles.memberName}>{member.name}</p>
                <p className={styles.memberDescription}>
                  {hoveredMember === member.name
                    ? member.translations.serious
                    : member.translations.funny}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} */