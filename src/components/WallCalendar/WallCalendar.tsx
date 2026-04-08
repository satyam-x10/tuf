import React, { useState, useEffect } from 'react';
import styles from './WallCalendar.module.css';
import HeroSection from './HeroSection';
import NotesSection from './NotesSection';
import DateGrid from './DateGrid';

const WallCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); // January 2022
  
  // Selection State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Reset selection when changing month (optional, but good UX usually, or keep it)
  // Let's keep selection across months for flexibility

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.spiralBinding}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={styles.ring}></div>
        ))}
      </div>
      
      <div 
        key={currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} 
        className={styles.pageWrapper}
      >
        <HeroSection month={monthName} year={year} />
        
        <div className={styles.calendarBody}>
        <div className={styles.sidebar}>
          <NotesSection 
            startDate={startDate} 
            endDate={endDate} 
            currentMonth={currentDate} 
          />
        </div>
        <div className={styles.mainContent}>
          <DateGrid 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            hoverDate={hoverDate}
            setHoverDate={setHoverDate}
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default WallCalendar;
