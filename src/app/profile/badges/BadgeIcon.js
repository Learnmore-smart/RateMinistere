import { Medal } from 'lucide-react';
import styles from './badge.module.css';
import { getBadgeById } from '@/app/utils/badgeUtils';
import Image from 'next/image';

export default function BadgeIcon({ onClick, activeBadge }) {
  const badge = getBadgeById(activeBadge)

  return (
    <div className={styles.badgeIconWrapper} onClick={onClick}>
      {(!badge || activeBadge == 0) ? (<Medal size={24} className={styles.badgeIcon} />
      ) : (
        <div className={styles.activeBadge}>
          <Image width={30} height={30} src={badge.src} alt={badge.name} />
        </div>
      )
      }
    </div>
  );
}