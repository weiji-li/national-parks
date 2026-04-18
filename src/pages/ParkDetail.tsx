import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParks } from '../hooks/useParks';
import { useTrackerStore } from '../store/useTrackerStore';
import HeroCarousel from '../components/Detail/HeroCarousel';
import ActivityTags from '../components/Detail/ActivityTags';
import AddVisitModal from '../components/Detail/AddVisitModal';
import styles from './ParkDetail.module.css';

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

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Loading park…</p>
      </div>
    );
  }

  if (!park) {
    return (
      <div className={styles.notFound}>
        <h1>Park not found</h1>
        <Link to="/explore">← Back to explore</Link>
      </div>
    );
  }

  const fee = park.entranceFees?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
              {fee && (
                <span className={styles.mono}>
                  💵 {fee.cost === '0.00' ? 'Free entry' : `$${fee.cost} entrance fee`}
                </span>
              )}
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
                  <button
                    className={styles.removeDate}
                    onClick={() => removeVisitDate(park.parkCode, d)}
                    title="Remove this visit"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {visit.notes && (
              <p className={styles.visitNote}>"{visit.notes}"</p>
            )}
          </div>
        )}

        {/* Description */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>About</h4>
          <p className={styles.description}>{park.description}</p>
        </div>

        {/* Activities */}
        {park.activities?.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Activities</h4>
            <ActivityTags activities={park.activities} />
          </div>
        )}

        {/* Two-column: hours + fees */}
        <div className={styles.infoGrid}>
          {park.operatingHours?.[0] && (
            <div className={styles.infoCard}>
              <h4 className={styles.sectionTitle}>Hours</h4>
              <div className={styles.hoursList}>
                {Object.entries(park.operatingHours[0].standardHours).map(([day, hours]) => (
                  <div key={day} className={styles.hoursRow}>
                    <span className={styles.day}>{day.slice(0, 3)}</span>
                    <span className={styles.hours}>{hours}</span>
                  </div>
                ))}
              </div>
              {park.operatingHours[0].description && (
                <p className={styles.hoursNote}>{park.operatingHours[0].description.slice(0, 200)}</p>
              )}
            </div>
          )}

          <div className={styles.infoCard}>
            <h4 className={styles.sectionTitle}>Entrance fees</h4>
            {park.entranceFees?.length > 0 ? (
              park.entranceFees.map((f, i) => (
                <div key={i} className={styles.feeRow}>
                  <div className={styles.feeTitle}>{f.title}</div>
                  <div className={styles.feeAmount}>
                    {f.cost === '0.00' ? 'Free' : `$${parseFloat(f.cost).toFixed(0)}`}
                  </div>
                  <div className={styles.feeDesc}>{f.description?.slice(0, 120)}</div>
                </div>
              ))
            ) : (
              <p className={styles.feeDesc}>No entrance fee information available.</p>
            )}
          </div>
        </div>

        {/* Weather */}
        {park.weatherInfo && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Weather</h4>
            <p className={styles.description}>{park.weatherInfo}</p>
          </div>
        )}

        {/* External link */}
        {park.url && (
          <div className={styles.externalLink}>
            <a href={park.url} target="_blank" rel="noopener noreferrer" className={styles.npsLink}>
              View on NPS.gov →
            </a>
          </div>
        )}
      </div>

      <AddVisitModal
        parkCode={park.parkCode}
        parkName={park.fullName}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </motion.div>
  );
}
