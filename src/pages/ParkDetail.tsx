import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParks } from '../hooks/useParks';
import { useTrackerStore } from '../store/useTrackerStore';
import HeroCarousel from '../components/Detail/HeroCarousel';
import ActivityTags from '../components/Detail/ActivityTags';
import AddVisitModal from '../components/Detail/AddVisitModal';
import styles from './ParkDetail.module.css';

const DAY_KEYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const;
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

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
    <div className={styles.loading}>
      <div className="spinner" />
      <p>Loading park…</p>
    </div>
  );

  if (!park) return (
    <div className={styles.notFound}>
      <h1>Park not found</h1>
      <Link to="/explore">← Back to explore</Link>
    </div>
  );

  const todayIdx = new Date().getDay();
  const hours = park.operatingHours?.[0];
  const mainFees = park.entranceFees?.filter(f => !f.title.toLowerCase().includes('commercial')) ?? [];
  const commercialFees = park.entranceFees?.filter(f => f.title.toLowerCase().includes('commercial')) ?? [];
  const mapUrl = `https://www.nps.gov/${park.parkCode}/planyourvisit/maps.htm`;

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
              {mainFees[0] && (
                <span className={styles.mono}>
                  {mainFees[0].cost === '0.00' ? '✓ Free entry' : `$${parseFloat(mainFees[0].cost).toFixed(0)} entrance`}
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
                  <button className={styles.removeDate} onClick={() => removeVisitDate(park.parkCode, d)} title="Remove this visit">×</button>
                </div>
              ))}
            </div>
            {visit.notes && <p className={styles.visitNote}>"{visit.notes}"</p>}
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

        {/* Hours + Fees */}
        <div className={styles.infoGrid}>
          {hours && (
            <div className={styles.infoCard}>
              <h4 className={styles.sectionTitle}>Hours</h4>
              <div className={styles.hoursGrid}>
                {DAY_KEYS.map((key, i) => {
                  const h = hours.standardHours[key];
                  const isToday = i === todayIdx;
                  const isClosed = h?.toLowerCase() === 'closed';
                  const isAllDay = h?.toLowerCase().includes('24') || h?.toLowerCase().includes('all day');
                  return (
                    <div key={key} className={`${styles.hoursRow} ${isToday ? styles.hoursToday : ''}`}>
                      <span className={styles.day}>{DAY_ABBR[i]}</span>
                      <span className={`${styles.hours} ${isClosed ? styles.hoursClosed : ''} ${isAllDay ? styles.hoursAllDay : ''}`}>
                        {isAllDay ? '24 hrs' : h || '—'}
                      </span>
                      {isToday && <span className={styles.todayDot} />}
                    </div>
                  );
                })}
              </div>
              {hours.description && (
                <p className={styles.hoursNote}>{hours.description.slice(0, 180)}{hours.description.length > 180 ? '…' : ''}</p>
              )}
            </div>
          )}

          <div className={styles.infoCard}>
            <h4 className={styles.sectionTitle}>Entrance fees</h4>
            {mainFees.length > 0 ? (
              <div className={styles.feeList}>
                {mainFees.map((f, i) => (
                  <div key={i} className={styles.feeCard}>
                    <div className={styles.feeCardTop}>
                      <span className={styles.feeTitle}>{f.title}</span>
                      <span className={styles.feeAmount}>
                        {f.cost === '0.00' ? <span className={styles.feeFree}>FREE</span> : `$${parseFloat(f.cost).toFixed(0)}`}
                      </span>
                    </div>
                    {f.description && <p className={styles.feeDesc}>{f.description.slice(0, 100)}{f.description.length > 100 ? '…' : ''}</p>}
                  </div>
                ))}
                {commercialFees.length > 0 && (
                  <p className={styles.feeCommercial}>+ {commercialFees.length} commercial rate{commercialFees.length > 1 ? 's' : ''}</p>
                )}
              </div>
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

        {/* Bottom row: NPS link + Park map */}
        <div className={styles.linkRow}>
          {park.url && (
            <a href={park.url} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
              <span className={styles.linkCardIcon}>↗</span>
              <div>
                <div className={styles.linkCardLabel}>Official website</div>
                <div className={styles.linkCardSub}>NPS.gov</div>
              </div>
            </a>
          )}
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
            <span className={styles.linkCardIcon}>◎</span>
            <div>
              <div className={styles.linkCardLabel}>Park map</div>
              <div className={styles.linkCardSub}>Brochure & trail maps</div>
            </div>
          </a>
        </div>
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
