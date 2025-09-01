'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

const Tooltip = ({ text, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Check if tooltip would overflow right side of viewport
      if (position === 'right' && rect.right + tooltip.offsetWidth > window.innerWidth) {
        setTooltipPosition('left');
      }
      // Check if tooltip would overflow left side of viewport
      else if (position === 'left' && rect.left - tooltip.offsetWidth < 0) {
        setTooltipPosition('right');
      }
      else {
        setTooltipPosition(position);
      }
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.tooltipContainer}
    >
      {children}
      <div
        ref={tooltipRef}
        className={`${styles.tooltip} ${styles[tooltipPosition]} ${isVisible ? styles.visible : ''}`}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;