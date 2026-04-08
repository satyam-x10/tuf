import React, { useMemo } from 'react';
import styles from './DateGrid.module.css';

interface DateGridProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  hoverDate: Date | null;
  setHoverDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DateGrid: React.FC<DateGridProps> = ({
  currentDate,
  setCurrentDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  hoverDate,
  setHoverDate
}) => {

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  // Generate grid days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the current month
    const firstDayOfMonth = new Date(year, month, 1);
    // Determine the day of the week (0 is Sunday, we want 1 for Monday)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust to make Monday the first day of the week
    firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
    
    const days: Date[] = [];
    
    // Previous month padding days
    const startDateGrid = new Date(year, month, 1 - (firstDayOfWeek - 1));
    
    // Generate exactly 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDateGrid.getFullYear(), startDateGrid.getMonth(), startDateGrid.getDate() + i));
    }
    
    return days;
  }, [currentDate]);

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isBefore = (date1: Date, date2: Date) => {
    return date1.getTime() < date2.getTime();
  };

  const isBetween = (date: Date, start: Date, end: Date) => {
    return date.getTime() > start.getTime() && date.getTime() < end.getTime();
  };

  const getDayClasses = (day: Date) => {
    const isOtherMonth = day.getMonth() !== currentDate.getMonth();
    const isToday = isSameDay(day, new Date());
    
    const isStart = isSameDay(day, startDate);
    const isEnd = isSameDay(day, endDate);
    
    let inRange = false;
    
    // Normal range
    if (startDate && endDate) {
      if (isBetween(day, startDate, endDate)) {
        inRange = true;
      }
    } 
    // Hover range
    else if (startDate && hoverDate && !endDate) {
      if (isBefore(startDate, hoverDate) && isBetween(day, startDate, hoverDate)) {
        inRange = true;
      } else if (isBefore(hoverDate, startDate) && isBetween(day, hoverDate, startDate)) {
        inRange = true;
      }
    }

    // Determine wrapper classes
    const wrapperClasses = [styles.dayWrapper];
    if (inRange) wrapperClasses.push(styles.inRange);
    if (isStart) wrapperClasses.push(styles.rangeStart);
    if (isEnd || (!endDate && hoverDate && isSameDay(day, hoverDate) && startDate && isBefore(startDate, day))) {
       if (startDate && ((endDate && !isSameDay(startDate, endDate)) || (!endDate && hoverDate && !isSameDay(startDate, hoverDate)))) {
         wrapperClasses.push(styles.rangeEnd);
       }
    }
    
    // Determine content classes
    const contentClasses = [styles.dayContent];
    if (isStart || isEnd) contentClasses.push(styles.selected);
    if (isToday) contentClasses.push(styles.today);
    
    return {
      wrapperClassName: wrapperClasses.join(' '),
      contentClassName: contentClasses.join(' '),
      isOtherMonth
    };
  };

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day);
      setEndDate(null);
    } else {
      // Complete selection
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleDateHover = (day: Date) => {
    if (startDate && !endDate) {
      setHoverDate(day);
    } else if (hoverDate !== null) {
      setHoverDate(null);
    }
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.header}>
        <div className={styles.navGroup}>
          <button className={styles.monthNav} onClick={handlePrevYear} aria-label="Previous Year">
            &laquo;
          </button>
          <button className={styles.monthNav} onClick={handlePrevMonth} aria-label="Previous Month">
            &lt;
          </button>
        </div>
        
        <span style={{ fontWeight: 600 }}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        
        <div className={styles.navGroup}>
          <button className={styles.monthNav} onClick={handleNextMonth} aria-label="Next Month">
            &gt;
          </button>
          <button className={styles.monthNav} onClick={handleNextYear} aria-label="Next Year">
            &raquo;
          </button>
        </div>
      </div>
      
      <div className={styles.weekdays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      
      <div className={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          const { wrapperClassName, contentClassName, isOtherMonth } = getDayClasses(day);
          
          return (
            <div 
              key={index} 
              className={`${wrapperClassName} ${isOtherMonth ? styles.isOtherMonth : ''}`}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => handleDateHover(day)}
            >
              <div className={contentClassName}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateGrid;
