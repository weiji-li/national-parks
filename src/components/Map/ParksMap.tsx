import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { useTrackerStore } from '../../store/useTrackerStore';
import { getParkImageUrl, parseLatLong } from '../../api/nps';
import type { EnrichedPark as NPSPark } from '../../hooks/useParks';
import styles from './ParksMap.module.css';

// Fix Leaflet default icon paths broken by Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createParkIcon(visited: boolean, wishlisted: boolean) {
  const color = visited ? '#c4622d' : wishlisted ? '#5a9e73' : '#c9a84c';
  const size = visited ? 14 : 11;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + 4}" height="${size + 4}" viewBox="0 0 ${size + 4} ${size + 4}">
      <circle cx="${(size + 4) / 2}" cy="${(size + 4) / 2}" r="${size / 2}" fill="${color}" opacity="0.9" />
      <circle cx="${(size + 4) / 2}" cy="${(size + 4) / 2}" r="${size / 2 + 1}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.35" />
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

function FitUS() {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (!fitted.current) {
      map.fitBounds([[24, -125], [50, -66]], { padding: [30, 30] });
      fitted.current = true;
    }
  }, [map]);
  return null;
}

interface Props {
  parks: NPSPark[];
}

export default function ParksMap({ parks }: Props) {
  const isVisited = useTrackerStore(s => s.isVisited);
  const isWishlisted = useTrackerStore(s => s.isWishlisted);

  const parksWithCoords = parks.filter(p => parseLatLong(p));

  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      {/* Dark minimal CartoDB tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Custom zoom control position */}
      <ZoomControl />
      <FitUS />

      {parksWithCoords.map(park => {
        const coords = parseLatLong(park)!;
        const visited = isVisited(park.parkCode);
        const wishlisted = isWishlisted(park.parkCode);
        const icon = createParkIcon(visited, wishlisted);

        return (
          <Marker
            key={park.parkCode}
            position={coords}
            icon={icon}
          >
            <Popup className={styles.popupWrap} closeButton={false} maxWidth={260}>
              <div className={styles.popup}>
                <Link to={`/park/${park.parkCode}`} className={styles.popupImgLink}>
                  <img
                    src={getParkImageUrl(park)}
                    alt={park.fullName}
                    className={styles.popupImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${park.parkCode}/260/140`;
                    }}
                  />
                  <div className={styles.popupImgOverlay} />
                  {visited && <span className={styles.popupVisitedTag}>✓ Visited</span>}
                </Link>
                <div className={styles.popupBody}>
                  <span className={styles.popupDesig}>{park.designation}</span>
                  <Link to={`/park/${park.parkCode}`} className={styles.popupName}>
                    {park.fullName}
                  </Link>
                  <div className={styles.popupMeta}>
                    <span className={styles.popupState}>{park.states}</span>
                    <Link to={`/park/${park.parkCode}`} className={styles.popupCta}>
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function ZoomControl() {
  const map = useMap();
  useEffect(() => {
    const ctrl = L.control.zoom({ position: 'bottomright' });
    ctrl.addTo(map);
    return () => { ctrl.remove(); };
  }, [map]);
  return null;
}
