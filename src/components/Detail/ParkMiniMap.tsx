import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './ParkMiniMap.module.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  lat: number;
  lng: number;
  name: string;
  parkCode: string;
}

interface BrochureImage {
  url: string;
  title: string;
}

async function fetchBrochureImage(parkCode: string): Promise<BrochureImage | null> {
  try {
    const res = await fetch(
      `https://developer.nps.gov/api/v1/multimedia/galleries?parkCode=${parkCode}&api_key=${import.meta.env.VITE_NPS_API_KEY || 'DEMO_KEY'}&limit=50`
    );
    const data = await res.json();
    const galleries: { title: string; images?: { url: string; title: string }[] }[] = data.data ?? [];
    for (const gallery of galleries) {
      const lower = gallery.title?.toLowerCase() ?? '';
      if (lower.includes('map') || lower.includes('brochure') || lower.includes('unigrid') || lower.includes('carto')) {
        const img = gallery.images?.[0];
        if (img?.url) return { url: img.url, title: gallery.title };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function ParkMiniMap({ lat, lng, name, parkCode }: Props) {
  const [brochure, setBrochure] = useState<BrochureImage | null>(null);
  const brochurePageUrl = `https://www.nps.gov/${parkCode}/planyourvisit/maps.htm`;

  useEffect(() => {
    fetchBrochureImage(parkCode).then(setBrochure);
  }, [parkCode]);

  return (
    <div className={styles.wrap}>
      {/* Satellite map */}
      <MapContainer
        center={[lat, lng]}
        zoom={10}
        className={styles.map}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>

      {/* Brochure image or download link */}
      {brochure ? (
        <div className={styles.brochureWrap}>
          <p className={styles.brochureLabel}>{brochure.title}</p>
          <a href={brochurePageUrl} target="_blank" rel="noopener noreferrer">
            <img src={brochure.url} alt={brochure.title} className={styles.brochureImg} />
          </a>
          <a href={brochurePageUrl} target="_blank" rel="noopener noreferrer" className={styles.brochureBtn}>
            ↓ Download official park map & brochure
          </a>
        </div>
      ) : (
        <a href={brochurePageUrl} target="_blank" rel="noopener noreferrer" className={styles.brochureBtn}>
          ↓ Download official park map & brochure
        </a>
      )}
    </div>
  );
}
