import React, { useState, useEffect } from 'react';
import styles from './NotesSection.module.css';

interface NotesSectionProps {
  startDate: Date | null;
  endDate: Date | null;
  currentMonth: Date;
}

const NotesSection: React.FC<NotesSectionProps> = ({ startDate, endDate, currentMonth }) => {
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | ''>('');

  // Determine the key for localStorage based on selection
  const storageKey = React.useMemo(() => {
    if (startDate && endDate) {
      return `calendar-notes-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}`;
    } else if (startDate) {
      return `calendar-notes-${startDate.toISOString().split('T')[0]}`;
    } else {
      return `calendar-notes-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    }
  }, [startDate, endDate, currentMonth]);

  // Determine the display title
  const displayTitle = React.useMemo(() => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (startDate) {
      return `${startDate.toLocaleDateString()}`;
    } else {
      return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  }, [startDate, endDate, currentMonth]);

  // Load notes when the key changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setNoteContent(saved || '');
    setSaveStatus('');
  }, [storageKey]);

  // Save notes locally
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNoteContent(value);
    setSaveStatus('saving');
    
    // Simple debounce/auto-save
    try {
      localStorage.setItem(storageKey, value);
      setTimeout(() => setSaveStatus('saved'), 500); // UI feel
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  return (
    <div className={styles.notesContainer}>
      <h2 className={styles.header}>Notes</h2>
      <div className={styles.subtitle}>{displayTitle}</div>
      
      <textarea
        className={styles.textarea}
        value={noteContent}
        onChange={handleChange}
        placeholder="Jot down memos, goals, or important reminders..."
      />
      
      <div className={styles.saveIndicator} style={{ opacity: saveStatus ? 1 : 0 }}>
        {saveStatus === 'saving' ? 'Saving...' : 'Saved locally'}
      </div>
    </div>
  );
};

export default NotesSection;
