import { NavLink } from 'react-router-dom';
import { useTrackerStore } from '../../store/useTrackerStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const visitedCount = useTrackerStore(s => s.getVisitedCount());

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.brandIcon}>◈</span>
        <span className={styles.brandText}>WILDERNESS LOG</span>
      </NavLink>

      <div className={styles.links}>
        <NavLink to="/explore" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          Explore
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          My Log
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          Dashboard
        </NavLink>
      </div>

      {visitedCount > 0 && (
        <div className={styles.counter}>
          <span className={styles.counterNum}>{visitedCount}</span>
          <span className={styles.counterLabel}>visited</span>
        </div>
      )}
    </nav>
  );
}
