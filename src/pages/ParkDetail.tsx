import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParks } from '../hooks/useParks';
import { useTrackerStore } from '../store/useTrackerStore';
import HeroCarousel from '../components/Detail/HeroCarousel';
import ActivityTags from '../components/Detail/ActivityTags';
import AddVisitModal from '../components/Detail/AddVisitModal';
import ParkMiniMap from '../components/Detail/ParkMiniMap';
import styles from './ParkDetail.module.css';

// Topics that reveal what makes a park unique
const HIGHLIGHT_KEYWORDS = [
  'geyser', 'hot spring', 'geothermal', 'volcano', 'glacier', 'waterfall', 'canyon',
  'cave', 'fossil', 'petrified', 'lava', 'tidal', 'reef', 'coral',
  'bison', 'wolf', 'bear', 'elk', 'moose', 'cat', 'whale', 'seal', 'manatee',
  'dolphin', 'alligator', 'crocodile', 'turtle', 'unique species', 'endangered', 'rare',
  'wilderness', 'night sky', 'coast', 'desert', 'wetland', 'rainforest', 'tundra',
  'bird', 'migration',
];

export default function ParkDetail() {
  const { parkCode } = useParams<{ parkCode: string }>();
  const { parks, loading } = useParks();
  const [modalOpen, setModalOpen] = useState(false);

  const park = parks.find(p => p.parkCode === parkCode);
  const isVisited = useTrackerStore(s => s.isVisited(parkCode!));
  const isWishlisted = useTrackerStore(s => s.isWishlisted(parkCode!));
  const toggleWishlist = useTrackerStore(s => s.toggleWishlist);
  const visit = useTrackerStore(s => s.getVisit(parkCode!));
  const removeVisitDate = useTrackerStore(s => s.removeVisitDate);

  if (loading) return (
    <div className={styles.loading}><div className="spinner" /><p>Loading park…</p></div>
  );
  if (!park) return (
    <div className={styles.notFound}><h1>Park not found</h1><Link to="/explore">← Back to explore</Link></div>
  );

  const lat = parseFloat(park.latitude);
  const lng = parseFloat(park.longitude);
  const hasCoords = !isNaN(lat) && !isNaN(lng);

  const highlights = (park.topics ?? []).filter(t =>
    HIGHLIGHT_KEYWORDS.some(k => t.name.toLowerCase().includes(k))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <HeroCarousel images={park.images} parkName={park.fullName} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumb}>
              <Link to="/explore" className={styles.backLink}>← Explore</Link>
              <span className={styles.breadSep}>/</span>
              <span className={styles.breadCurrent}>{park.states}</span>
            </div>
            <div className={styles.designation}>{park.designation}</div>
            <h1 className={styles.title}>{park.fullName}</h1>
            <div className={styles.stateMeta}>
              <span className={styles.mono}>📍 {park.states}</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              className={`${styles.actionBtn} ${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={() => toggleWishlist(park.parkCode)}
            >
              {isWishlisted ? '★ On Wishlist' : '☆ Add to Wishlist'}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.visitBtn} ${isVisited ? styles.visitedStyle : ''}`}
              onClick={() => setModalOpen(true)}
            >
              {isVisited ? '✓ Visited — Add another date' : '+ Log a visit'}
            </button>
          </div>
        </div>

        {/* Visit history */}
        {visit && visit.dates.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Your visits</h4>
            <div className={styles.visitList}>
              {visit.dates.map(d => (
                <div key={d} className={styles.visitEntry}>
                  <span className={styles.visitDate}>{new Date(d + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <button className={styles.removeDate} onClick={() => removeVisitDate(park.parkCode, d)} title="Remove this visit">×</button>
                </div>
              ))}
            </div>
            {visit.notes && <p className={styles.visitNote}>"{visit.notes}"</p>}
          </div>
        )}

        {/* About */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>About</h4>
          <p className={styles.description}>{park.description}</p>
        </div>

        {/* What makes it special */}
        {highlights.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>What makes it special</h4>
            <div className={styles.highlightWrap}>
              {highlights.map(t => (
                <span key={t.id} className={styles.highlight}>{t.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {park.activities?.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Activities</h4>
            <ActivityTags activities={park.activities} />
          </div>
        )}

        {/* Map */}
        {hasCoords && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Park map</h4>
            <ParkMiniMap lat={lat} lng={lng} name={park.fullName} parkCode={park.parkCode} />
          </div>
        )}

        {/* Weather */}
        {park.weatherInfo && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Weather</h4>
            <p className={styles.description}>{park.weatherInfo}</p>
          </div>
        )}

        {/* NPS link */}
        {park.url && (
          <div className={styles.linkRow}>
            <a href={park.url} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
              <span className={styles.linkCardIcon}>↗</span>
              <div>
                <div className={styles.linkCardLabel}>Official website</div>
                <div className={styles.linkCardSub}>NPS.gov</div>
              </div>
            </a>
          </div>
        )}
      </div>

      <AddVisitModal parkCode={park.parkCode} parkName={park.fullName} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}
