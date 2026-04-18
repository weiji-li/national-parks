import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NPSImage } from '../../types/nps';
import styles from './HeroCarousel.module.css';

interface Props {
  images: NPSImage[];
  parkName: string;
}

export default function HeroCarousel({ images, parkName }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.heroPlaceholder}>
        <span className={styles.placeholderText}>{parkName}</span>
      </div>
    );
  }

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className={styles.hero}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current].url}
          alt={images[current].altText || parkName}
          className={styles.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      <div className={styles.overlay} />

      {images.length > 1 && (
        <>
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>‹</button>
          <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>›</button>

          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}

      {images[current].credit && (
        <div className={styles.credit}>Photo: {images[current].credit}</div>
      )}
    </div>
  );
}
