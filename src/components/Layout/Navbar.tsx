import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTrackerStore } from '../../store/useTrackerStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const visitedCount = useTrackerStore(s => s.getVisitedCount());
  const close = () => setMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandIcon}>◈</span>
          <span className={styles.brandText}>WILDERNESS LOG</span>
        </NavLink>

        <div className={styles.links}>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/log" className={linkClass}>My Log</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        </div>

        {visitedCount > 0 && (
          <div className={styles.counter}>
            <span className={styles.counterNum}>{visitedCount}</span>
            <span className={styles.counterLabel}>visited</span>
          </div>
        )}

        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/explore" className={linkClass} onClick={close}>Explore</NavLink>
          <NavLink to="/log" className={linkClass} onClick={close}>My Log</NavLink>
          <NavLink to="/dashboard" className={linkClass} onClick={close}>Dashboard</NavLink>
        </div>
      )}
    </>
  );
}
