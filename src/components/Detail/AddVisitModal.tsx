import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackerStore } from '../../store/useTrackerStore';
import styles from './AddVisitModal.module.css';

interface Props {
  parkCode: string;
  parkName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVisitModal({ parkCode, parkName, isOpen, onClose }: Props) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const addVisit = useTrackerStore(s => s.addVisit);
  const visit = useTrackerStore(s => s.getVisit(parkCode));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    addVisit(parkCode, date, note);
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className={styles.header}>
              <div>
                <h4 className={styles.label}>Log a visit</h4>
                <h2 className={styles.title}>{parkName}</h2>
              </div>
              <button className={styles.close} onClick={onClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.fieldLabel}>Date visited</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className={styles.input}
                required
              />

              <label className={styles.fieldLabel}>Notes (optional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What did you see? How was the weather?"
                className={styles.textarea}
                rows={4}
              />

              {visit && visit.dates.length > 0 && (
                <div className={styles.prevVisits}>
                  <span className={styles.fieldLabel}>Previous visits</span>
                  <div className={styles.dateList}>
                    {visit.dates.map(d => (
                      <span key={d} className={styles.dateTag}>{d}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Mark visited
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
