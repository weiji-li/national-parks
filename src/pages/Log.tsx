import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrackerStore } from '../store/useTrackerStore';
import { useParks } from '../hooks/useParks';
import { getParkImageUrl } from '../api/nps';
import styles from './Log.module.css';

export default function Log() {
  const { parks } = useParks();
  const visits = useTrackerStore(s => s.visits);
  const removeVisitDate = useTrackerStore(s => s.removeVisitDate);

  const parksByCode = useMemo(() => new Map(parks.map(p => [p.parkCode, p])), [parks]);

  // Flatten all visits into a sorted list (newest first)
  const allVisits = useMemo(() => {
    const entries: Array<{ parkCode: string; date: string; note: string }> = [];
    for (const visit of Object.values(visits)) {
      for (const date of visit.dates) {
        entries.push({ parkCode: visit.parkCode, date, note: visit.notes });
      }
    }
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }, [visits]);

  const visitedCount = Object.keys(visits).length;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.header}>
        <div>
          <h4 className={styles.eyebrow}>Personal record</h4>
          <h1 className={styles.title}>My Visit Log</h1>
        </div>
        {visitedCount > 0 && (
          <div className={styles.summary}>
            <span className={styles.summaryNum}>{allVisits.length}</span>
            <span className={styles.summaryLbl}>total visits</span>
            <span className={styles.summaryDivider}>·</span>
            <span className={styles.summaryNum}>{visitedCount}</span>
            <span className={styles.summaryLbl}>unique parks</span>
          </div>
        )}
      </div>

      {allVisits.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◈</div>
          <h2 className={styles.emptyTitle}>No visits logged yet</h2>
          <p className={styles.emptyDesc}>
            Head to a park's detail page and hit "Log a visit" to start your record.
          </p>
          <Link to="/explore" className={styles.emptyLink}>Explore parks →</Link>
        </div>
      ) : (
        <div className={styles.timeline}>
          {allVisits.map(({ parkCode, date, note }, i) => {
            const park = parksByCode.get(parkCode);
            const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
            });

            return (
              <motion.div
                key={`${parkCode}-${date}`}
                className={styles.entry}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.8) }}
              >
                <div className={styles.entryDate}>{formattedDate}</div>
                <div className={styles.entryCard}>
                  {park && (
                    <Link to={`/park/${parkCode}`}>
                      <img
                        src={getParkImageUrl(park)}
                        alt={park.fullName}
                        className={styles.thumb}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${parkCode}/100/70`;
                        }}
                      />
                    </Link>
                  )}
                  <div className={styles.entryInfo}>
                    {park ? (
                      <>
                        <span className={styles.entryDesig}>{park.designation}</span>
                        <Link to={`/park/${parkCode}`} className={styles.entryName}>
                          {park.fullName}
                        </Link>
                        <span className={styles.entryState}>{park.states}</span>
                      </>
                    ) : (
                      <span className={styles.entryName}>{parkCode}</span>
                    )}
                    {note && <p className={styles.entryNote}>"{note}"</p>}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeVisitDate(parkCode, date)}
                    title="Remove this visit"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
