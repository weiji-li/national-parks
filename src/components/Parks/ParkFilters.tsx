import { useMemo } from 'react';
import type { EnrichedPark } from '../../hooks/useParks';
import styles from './ParkFilters.module.css';

export type ViewMode = 'grid' | 'list' | 'map';
export type VisitFilter = 'all' | 'visited' | 'wishlist' | 'unvisited';
export type SortBy = 'popularity' | 'visitors' | 'alpha' | 'state';
export type ScopeMode = 'np' | 'all';

interface Props {
  parks: EnrichedPark[];
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  selectedState: string;
  onState: (s: string) => void;
  visitFilter: VisitFilter;
  onVisitFilter: (f: VisitFilter) => void;
  sortBy: SortBy;
  onSortBy: (s: SortBy) => void;
  scope: ScopeMode;
  onScope: (s: ScopeMode) => void;
  resultCount: number;
}

export default function ParkFilters({
  parks,
  viewMode, onViewMode,
  searchQuery, onSearch,
  selectedState, onState,
  visitFilter, onVisitFilter,
  sortBy, onSortBy,
  scope, onScope,
  resultCount,
}: Props) {
  const states = useMemo(() => {
    const set = new Set<string>();
    parks.forEach(p => p.states.split(',').forEach(s => set.add(s.trim())));
    return Array.from(set).sort();
  }, [parks]);

  return (
    <div className={styles.bar}>
      {/* Scope toggle */}
      <div className={styles.scopeToggle}>
        <button
          className={`${styles.scopeBtn} ${scope === 'np' ? styles.scopeActive : ''}`}
          onClick={() => onScope('np')}
        >
          National Parks
        </button>
        <button
          className={`${styles.scopeBtn} ${scope === 'all' ? styles.scopeActive : ''}`}
          onClick={() => onScope('all')}
        >
          All Sites
        </button>
      </div>

      <div className={styles.divider} />

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search parks…"
          className={styles.search}
        />
        {searchQuery && (
          <button className={styles.clearBtn} onClick={() => onSearch('')}>×</button>
        )}
      </div>

      {/* State filter */}
      <select value={selectedState} onChange={e => onState(e.target.value)} className={styles.select}>
        <option value="">All states / provinces</option>
        {states.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Sort */}
      <select value={sortBy} onChange={e => onSortBy(e.target.value as SortBy)} className={styles.select}>
        <option value="popularity">Sort: Popularity</option>
        <option value="visitors">Sort: Visitor Count</option>
        <option value="alpha">Sort: A → Z</option>
        <option value="state">Sort: State</option>
      </select>

      <div className={styles.divider} />

      {/* Visit filter */}
      <div className={styles.visitBtns}>
        {(['all', 'visited', 'wishlist', 'unvisited'] as VisitFilter[]).map(f => (
          <button
            key={f}
            className={`${styles.visitBtn} ${visitFilter === f ? styles.visitActive : ''}`}
            onClick={() => onVisitFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Count + view toggle */}
      <span className={styles.count}>{resultCount}</span>
      <div className={styles.viewToggle}>
        {(['grid', 'list', 'map'] as ViewMode[]).map(v => (
          <button
            key={v}
            className={`${styles.viewBtn} ${viewMode === v ? styles.viewActive : ''}`}
            onClick={() => onViewMode(v)}
            title={`${v.charAt(0).toUpperCase() + v.slice(1)} view`}
          >
            {v === 'grid' ? '⊞' : v === 'list' ? '≡' : '◎'}
          </button>
        ))}
      </div>
    </div>
  );
}
