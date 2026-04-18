import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrackerStore } from '../store/useTrackerStore';
import { useParks } from '../hooks/useParks';
import { computeBadges } from '../utils/badges';
import StatsPanel from '../components/Dashboard/StatsPanel';
import BadgeGrid from '../components/Dashboard/BadgeGrid';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { parks } = useParks();
  const visits = useTrackerStore(s => s.visits);
  const visitedCount = useTrackerStore(s => s.getVisitedCount());

  const badges = computeBadges(visits, parks);
  const unlockedBadges = badges.filter(b => b.unlocked);

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
          <h4 className={styles.eyebrow}>Explorer profile</h4>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
        {unlockedBadges.length > 0 && (
          <div className={styles.badgeSummary}>
            <span className={styles.badgeIcons}>
              {unlockedBadges.slice(0, 4).map(b => b.icon).join(' ')}
            </span>
            <span className={styles.badgeCount}>
              {unlockedBadges.length} / {badges.length} badges
            </span>
          </div>
        )}
      </div>

      {visitedCount === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🧭</div>
          <h2 className={styles.emptyTitle}>Your adventure begins here</h2>
          <p className={styles.emptyDesc}>
            Start logging visits to see your stats, unlock badges, and track your progress.
          </p>
          <Link to="/explore" className={styles.emptyLink}>Explore parks →</Link>
        </div>
      ) : (
        <div className={styles.sections}>
          <section>
            <h2 className={styles.sectionHeading}>Statistics</h2>
            <StatsPanel visits={visits} parks={parks} />
          </section>

          <section>
            <h2 className={styles.sectionHeading}>
              Achievements
              <span className={styles.sectionSub}>
                {unlockedBadges.length} unlocked
              </span>
            </h2>
            <BadgeGrid badges={badges} />
          </section>
        </div>
      )}
    </motion.div>
  );
}
