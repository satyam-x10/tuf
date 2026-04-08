import React from 'react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  month: string;
  year: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ month, year }) => {
  return (
    <div className={styles.heroContainer}>
      <img src="/images/january.png" alt="Hero representation of month" className={styles.heroImage} />
      <div className={styles.titleOverlay}>
        <div className={styles.year}>{year}</div>
        <div className={styles.month}>{month}</div>
      </div>
    </div>
  );
};

export default HeroSection;
