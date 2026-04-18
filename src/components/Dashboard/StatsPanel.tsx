import { motion } from 'framer-motion';
import type { EnrichedPark as NPSPark } from '../../hooks/useParks';
import styles from './StatsPanel.module.css';

interface Props {
  visits: Record<string, { parkCode: string; dates: string[]; notes: string }>;
  parks: NPSPark[];
}

export default function StatsPanel({ visits, parks }: Props) {
  const visitedCodes = Object.keys(visits);
  const totalParks = parks.length;
  const visitedCount = visitedCodes.length;
  const percent = totalParks > 0 ? Math.round((visitedCount / totalParks) * 100) : 0;

  // States covered
  const stateMap = new Map<string, number>();
  const parksByCode = new Map(parks.map(p => [p.parkCode, p]));
  for (const code of visitedCodes) {
    const park = parksByCode.get(code);
    if (park?.states) {
      park.states.split(',').forEach(s => {
        const st = s.trim();
        stateMap.set(st, (stateMap.get(st) || 0) + 1);
      });
    }
  }

  const topStates = Array.from(stateMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Years
  const yearMap = new Map<string, number>();
  for (const visit of Object.values(visits)) {
    for (const date of visit.dates) {
      const year = date.slice(0, 4);
      yearMap.set(year, (yearMap.get(year) || 0) + 1);
    }
  }
  const years = Array.from(yearMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const maxYear = Math.max(...years.map(([, c]) => c), 1);

  // Total visit days
  const totalVisitDays = Object.values(visits).reduce((sum, v) => sum + v.dates.length, 0);

  const stats = [
    { label: 'Parks visited', value: visitedCount, sub: `of ${totalParks} total` },
    { label: 'Completion', value: `${percent}%`, sub: 'of all NPS units' },
    { label: 'States covered', value: stateMap.size, sub: 'unique states' },
    { label: 'Total visit days', value: totalVisitDays, sub: 'logged days' },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.statCards}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.stat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statSub}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {totalVisitDays > 0 && (
        <div className={styles.progressWrap}>
          <div className={styles.sectionTitle}>Overall progress</div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <div className={styles.progressLabel}>{visitedCount} / {totalParks} parks</div>
        </div>
      )}

      {topStates.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Parks by state</div>
          <div className={styles.stateList}>
            {topStates.map(([state, count]) => (
              <div key={state} className={styles.stateRow}>
                <span className={styles.stateCode}>{state}</span>
                <div className={styles.stateBar}>
                  <motion.div
                    className={styles.stateBarFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / (topStates[0]?.[1] || 1)) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <span className={styles.stateCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {years.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Visits per year</div>
          <div className={styles.yearChart}>
            {years.map(([year, count]) => (
              <div key={year} className={styles.yearCol}>
                <span className={styles.yearCount}>{count}</span>
                <div className={styles.yearBarWrap}>
                  <motion.div
                    className={styles.yearBar}
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxYear) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className={styles.yearLabel}>{year}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
