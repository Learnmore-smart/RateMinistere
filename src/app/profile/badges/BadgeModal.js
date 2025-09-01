import { useState } from 'react';
import BadgeList from './BadgeList';
import { X, Search } from 'lucide-react';
import styles from './badge.module.css';

export default function BadgeModal({ onClose, onSelectBadge, badges }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewBadge, setPreviewBadge] = useState(null);
  const [isClosing, setIsClosing] = useState(false); // State for fade-out animation

  const categories = ['all', 'achievements', 'special', 'seasonal'];

  const filteredBadges = badges || [];

  const handleBadgeClick = (badge) => {
    onSelectBadge(badge);
  };

  const handleClose = () => {
    setIsClosing(true); // Trigger fade-out animation
    setTimeout(onClose, 300); // Delay unmounting to match animation duration
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`}
      >
        <div className={styles.modalHeader}>
          <h2>Choose Your Badge</h2>
          <button
            className={styles["close-button"]}
            onClick={handleClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.searchBar}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search badges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.badgeContainer}>
          <BadgeList
            badges={filteredBadges}
            onSelect={handleBadgeClick}
          />

          {/* {previewBadge && (
            <div className={styles.previewPanel}>
              <img src={previewBadge.src} alt={previewBadge.name} />
              <h3>{previewBadge.name}</h3>
              <p>{previewBadge.description}</p>
              <button
                className={styles.selectButton}
                onClick={() => handleBadgeClick(previewBadge)}
              >
                Select Badge
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}