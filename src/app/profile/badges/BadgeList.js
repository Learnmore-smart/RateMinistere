'use client'
import Image from 'next/image';
import styles from './badge.module.css';
import { getBadgesById } from '@/app/utils/badgeUtils';

export default function BadgeList({ badges, onSelect }) {
  //add no badge display
  badges.push(0)

  return (
    <div className={styles.badgeGrid}>
      {getBadgesById(badges).map((badge) => {
        return (
          <div
            key={badge.id}
            className={styles.badgeItem}
            onClick={() => onSelect(badge)}
          >
            <Image width={100} height={100} src={badge.src} alt={badge.name} />
            <div className={styles.badgeInfo}>
              <h4>{badge.name}</h4>
              <p>{badge.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}