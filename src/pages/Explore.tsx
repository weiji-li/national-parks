import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParks } from '../hooks/useParks';
import { useTrackerStore } from '../store/useTrackerStore';
import ParkCard from '../components/Parks/ParkCard';
import ParkListItem from '../components/Parks/ParkListItem';
import ParkFilters from '../components/Parks/ParkFilters';
import ParksMap from '../components/Map/ParksMap';
import { POPULARITY } from '../data/popularity';
import type { ViewMode, VisitFilter, SortBy, ScopeMode } from '../components/Parks/ParkFilters';
import styles from './Explore.module.css';

// Designations that count as a "National Park" for scope filtering
const NP_DESIGNATIONS = new Set([
  'National Park',
  'National Park & Preserve',
  'National Park and Preserve',
  'National Park of American Samoa',
  'National Park (Canada)',
  'National Park Reserve (Canada)',
]);

export default function Explore() {
  const { parks, loading, error } = useParks();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [visitFilter, setVisitFilter] = useState<VisitFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [scope, setScope] = useState<ScopeMode>('np'); // 'np' | 'all'

  const isVisited = useTrackerStore(s => s.isVisited);
  const isWishlisted = useTrackerStore(s => s.isWishlisted);

  // Scope: National Parks only vs all NPS/Parks Canada sites
  const scopedParks = useMemo(() => {
    if (scope === 'all') return parks;
    return parks.filter(p => NP_DESIGNATIONS.has(p.designation));
  }, [parks, scope]);

  // Filter
  const filtered = useMemo(() => {
    return scopedParks.filter(park => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !park.fullName.toLowerCase().includes(q) &&
          !park.states.toLowerCase().includes(q) &&
          !(park.description ?? '').toLowerCase().includes(q)
        ) return false;
      }
      if (selectedState && !park.states.split(',').map(s => s.trim()).includes(selectedState)) {
        return false;
      }
      if (visitFilter === 'visited' && !isVisited(park.parkCode)) return false;
      if (visitFilter === 'wishlist' && !isWishlisted(park.parkCode)) return false;
      if (visitFilter === 'unvisited' && isVisited(park.parkCode)) return false;
      return true;
    });
  }, [scopedParks, searchQuery, selectedState, visitFilter, isVisited, isWishlisted]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popularity': {
          const pa = POPULARITY[a.parkCode];
          const pb = POPULARITY[b.parkCode];
          // visited parks without popularity data go to end
          if (!pa && !pb) return a.fullName.localeCompare(b.fullName);
          if (!pa) return 1;
          if (!pb) return -1;
          return pa.visitors - pb.visitors > 0 ? -1 : 1;
        }
        case 'visitors': {
          const pa = POPULARITY[a.parkCode]?.visitors ?? 0;
          const pb = POPULARITY[b.parkCode]?.visitors ?? 0;
          return pb - pa;
        }
        case 'alpha':
          return a.fullName.localeCompare(b.fullName);
        case 'state':
          return a.states.localeCompare(b.states);
        default:
          return 0;
      }
    });
  }, [filtered, sortBy]);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ParkFilters
        parks={scopedParks}
        viewMode={viewMode}
        onViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedState={selectedState}
        onState={setSelectedState}
        visitFilter={visitFilter}
        onVisitFilter={setVisitFilter}
        sortBy={sortBy}
        onSortBy={setSortBy}
        scope={scope}
        onScope={setScope}
        resultCount={sorted.length}
      />

      {loading && (
        <div className={styles.loadingState}>
          <div className="spinner" />
          <p className={styles.loadingText}>Loading parks…</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Failed to load parks</p>
          <p className={styles.errorSub}>{error}</p>
          <p className={styles.errorHint}>
            Check <code>.env</code> — <code>DEMO_KEY</code> has rate limits (50 req/hr).
          </p>
        </div>
      )}

      {!loading && !error && viewMode === 'map' && (
        <div className={styles.mapContainer}>
          <ParksMap parks={sorted} />
        </div>
      )}

      {!loading && !error && viewMode === 'grid' && (
        <div className={styles.grid}>
          {sorted.map((park, i) => (
            <ParkCard key={park.parkCode} park={park} index={i} />
          ))}
          {sorted.length === 0 && <EmptyState />}
        </div>
      )}

      {!loading && !error && viewMode === 'list' && (
        <div className={styles.list}>
          {sorted.map((park, i) => (
            <ParkListItem key={park.parkCode} park={park} index={i} />
          ))}
          {sorted.length === 0 && <EmptyState />}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '5rem 2rem', textAlign: 'center', gridColumn: '1/-1' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>◈</div>
      <p style={{ fontFamily: 'Abril Fatface, serif', fontSize: '1.3rem', color: 'var(--text-muted)' }}>
        No parks match your filters
      </p>
    </div>
  );
}
