import { motion } from 'framer-motion';
import type { Badge } from '../../utils/badges';
import styles from './BadgeGrid.module.css';

interface Props {
  badges: Badge[];
}

export default function BadgeGrid({ badges }: Props) {
  return (
    <div className={styles.grid}>
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className={`${styles.badge} ${badge.unlocked ? styles.unlocked : styles.locked}`}
        >
          <div className={styles.icon}>{badge.unlocked ? badge.icon : '🔒'}</div>
          <div className={styles.info}>
            <span className={styles.name}>{badge.name}</span>
            <span className={styles.desc}>{badge.description}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
