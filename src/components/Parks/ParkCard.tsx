import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrackerStore } from '../../store/useTrackerStore';
import { getParkImageUrl } from '../../api/nps';
import { POPULARITY, formatVisitors } from '../../data/popularity';
import type { EnrichedPark } from '../../hooks/useParks';
import styles from './ParkCard.module.css';

interface Props {
  park: EnrichedPark;
  index?: number;
}

export default function ParkCard({ park, index = 0 }: Props) {
  const isVisited = useTrackerStore(s => s.isVisited(park.parkCode));
  const isWishlisted = useTrackerStore(s => s.isWishlisted(park.parkCode));
  const toggleWishlist = useTrackerStore(s => s.toggleWishlist);
  const imageUrl = getParkImageUrl(park);
  const popularity = POPULARITY[park.parkCode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.7), ease: 'easeOut' }}
      className={`${styles.card} ${isVisited ? styles.visitedCard : ''}`}
    >
      <Link to={`/park/${park.parkCode}`} className={styles.imageLink}>
        <img
          src={imageUrl}
          alt={park.fullName}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${park.parkCode}/600/420`;
          }}
        />
        <div className={styles.gradient} />

        {/* Top-left badges */}
        <div className={styles.topLeft}>
          {park.country === 'CA' && <span className={styles.countryBadge}>🇨🇦</span>}
          {isVisited && <span className={styles.visitedBadge}>✓ Visited</span>}
        </div>

        {/* Top-right wishlist */}
        <button
          className={`${styles.wishFloat} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={e => { e.preventDefault(); toggleWishlist(park.parkCode); }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '★' : '☆'}
        </button>

        {/* Bottom text overlay */}
        <div className={styles.overlay}>
          <div className={styles.meta}>
            <span className={styles.designation}>{park.designation}</span>
            <span className={styles.states}>{park.states}</span>
          </div>
          <h3 className={styles.name}>{park.fullName}</h3>
          {popularity && (
            <div className={styles.visitors}>
              <span className={styles.visitorCount}>{formatVisitors(popularity.visitors)}</span>
              <span className={styles.visitorLabel}> visitors/yr</span>
            </div>
          )}
        </div>
      </Link>

      {/* Description strip */}
      <div className={styles.desc}>
        {park.description?.slice(0, 110)}{(park.description?.length ?? 0) > 110 ? '…' : ''}
      </div>
    </motion.div>
  );
}
