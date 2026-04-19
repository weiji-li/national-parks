import styles from './ParkMiniMap.module.css';

interface Props {
  lat: number;
  lng: number;
  name: string;
  parkCode: string;
}

export default function ParkMiniMap({ lat, lng, name, parkCode }: Props) {
  const gmapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=11&output=embed&hl=en`;
  const brochureUrl = `https://www.nps.gov/${parkCode}/planyourvisit/brochures.htm`;

  return (
    <div className={styles.wrap}>
      <iframe
        title={`Map of ${name}`}
        src={gmapSrc}
        className={styles.map}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className={styles.brochureBtn}>
        ↓ Download official park brochure & map
      </a>
    </div>
  );
}
