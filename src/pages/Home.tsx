import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrackerStore } from '../store/useTrackerStore';
import styles from './Home.module.css';

const PARK_NAMES = [
  'Yellowstone', 'Yosemite', 'Grand Canyon', 'Zion', 'Olympic',
  'Acadia', 'Rocky Mountain', 'Glacier', 'Great Smoky Mountains',
  'Joshua Tree', 'Arches', 'Bryce Canyon', 'Canyonlands', 'Sequoia',
  'Death Valley', 'Everglades', 'Crater Lake', 'Mt. Rainier',
];

export default function Home() {
  const visitedCount = useTrackerStore(s => s.getVisitedCount());
  const wishlistCount = useTrackerStore(s => s.wishlist.length);

  return (
    <PageTransitionWrapper>
      <div className={styles.page}>
        {/* Animated park name ticker */}
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[...PARK_NAMES, ...PARK_NAMES].map((name, i) => (
              <span key={i} className={styles.tickerItem}>{name}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className={styles.hero}>
          <motion.div
            className={styles.heroInner}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.eyebrow}>Your National Parks Journal</div>
            <h1 className={styles.headline}>
              Every park<br />
              <span className={styles.accent}>has a story.</span>
            </h1>
            <p className={styles.sub}>
              Explore all 400+ National Park Service sites. Track where you've been,
              plan where you're going, and celebrate every summit.
            </p>

            <div className={styles.ctas}>
              <Link to="/explore" className={styles.primaryCta}>
                Start exploring →
              </Link>
              {visitedCount > 0 && (
                <Link to="/dashboard" className={styles.secondaryCta}>
                  View my {visitedCount} visited parks
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        {(visitedCount > 0 || wishlistCount > 0) && (
          <motion.div
            className={styles.statsStrip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {visitedCount > 0 && (
              <div className={styles.statItem}>
                <span className={styles.statNum}>{visitedCount}</span>
                <span className={styles.statLbl}>Parks visited</span>
              </div>
            )}
            {wishlistCount > 0 && (
              <div className={styles.statItem}>
                <span className={styles.statNum}>{wishlistCount}</span>
                <span className={styles.statLbl}>On wishlist</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Feature cards */}
        <div className={styles.features}>
          {[
            {
              icon: '◎',
              title: 'Map View',
              desc: 'See every park on an interactive topographic map. Click any marker for photos and details.',
              link: '/explore',
              linkText: 'Open map',
            },
            {
              icon: '⊞',
              title: 'Browse & Filter',
              desc: 'Filter 400+ parks by state, type, or activity. Toggle between grid and list views.',
              link: '/explore',
              linkText: 'Browse parks',
            },
            {
              icon: '✓',
              title: 'Visit Tracker',
              desc: 'Log your visits with dates and notes. Track multiple trips to the same park.',
              link: '/log',
              linkText: 'My log',
            },
            {
              icon: '🦅',
              title: 'Achievements',
              desc: 'Earn badges as you explore — from First Steps to the Grand Slam of all 63 National Parks.',
              link: '/dashboard',
              linkText: 'Dashboard',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.feature}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            >
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <Link to={f.link} className={styles.featureLink}>{f.linkText} →</Link>
            </motion.div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>Data from the </span>
          <a
            href="https://www.nps.gov/subjects/developer/api-documentation.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            National Park Service API
          </a>
          <span> · Photos © NPS</span>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
