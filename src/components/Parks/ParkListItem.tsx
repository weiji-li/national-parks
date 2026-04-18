import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrackerStore } from '../../store/useTrackerStore';
import { getParkImageUrl } from '../../api/nps';
import { POPULARITY, formatVisitors } from '../../data/popularity';
import type { EnrichedPark } from '../../hooks/useParks';
import styles from './ParkListItem.module.css';

interface Props {
  park: EnrichedPark;
  index?: number;
}

export default function ParkListItem({ park, index = 0 }: Props) {
  const isVisited = useTrackerStore(s => s.isVisited(park.parkCode));
  const isWishlisted = useTrackerStore(s => s.isWishlisted(park.parkCode));
  const toggleWishlist = useTrackerStore(s => s.toggleWishlist);
  const imageUrl = getParkImageUrl(park);
  const popularity = POPULARITY[park.parkCode];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.6) }}
      className={`${styles.item} ${isVisited ? styles.visited : ''}`}
    >
      <Link to={`/park/${park.parkCode}`} className={styles.thumb}>
        <img
          src={imageUrl}
          alt={park.fullName}
          className={styles.thumbImg}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${park.parkCode}/120/80`;
          }}
        />
        {isVisited && <div className={styles.visitedDot} title="Visited" />}
      </Link>

      <div className={styles.content}>
        <div className={styles.top}>
          <div>
            {park.country === 'CA' && <span style={{ marginRight: '0.3rem' }}>🇨🇦</span>}
            <span className={styles.designation}>{park.designation || 'Park Unit'}</span>
            <span className={styles.sep}>·</span>
            <span className={styles.states}>{park.states}</span>
            {popularity && (
              <>
                <span className={styles.sep}>·</span>
                <span className={styles.visitors}>{formatVisitors(popularity.visitors)}/yr</span>
              </>
            )}
          </div>
          <Link to={`/park/${park.parkCode}`} className={styles.nameLink}>
            <h3 className={styles.name}>{park.fullName}</h3>
          </Link>
        </div>
        <p className={styles.desc}>
          {park.description?.slice(0, 160)}{(park.description?.length ?? 0) > 160 ? '…' : ''}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={() => toggleWishlist(park.parkCode)}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '★' : '☆'}
        </button>
        <Link to={`/park/${park.parkCode}`} className={styles.arrow}>→</Link>
      </div>
    </motion.div>
  );
}
