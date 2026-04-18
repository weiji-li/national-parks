import { useState, useEffect } from 'react';
import { fetchAllParks } from '../api/nps';
import { CANADIAN_PARKS } from '../data/canadianParks';
import type { NPSPark } from '../types/nps';

export interface EnrichedPark extends NPSPark {
  country: 'US' | 'CA';
}

interface UseParksResult {
  parks: EnrichedPark[];
  loading: boolean;
  error: string | null;
}

let globalParks: EnrichedPark[] | null = null;
let globalPromise: Promise<EnrichedPark[]> | null = null;

function buildParks(): Promise<EnrichedPark[]> {
  return fetchAllParks().then(usPark => {
    const us: EnrichedPark[] = usPark.map(p => ({ ...p, country: 'US' as const }));
    const ca: EnrichedPark[] = CANADIAN_PARKS.map(p => ({ ...p, country: 'CA' as const }));
    return [...us, ...ca];
  });
}

export function useParks(): UseParksResult {
  const [parks, setParks] = useState<EnrichedPark[]>(globalParks ?? []);
  const [loading, setLoading] = useState(!globalParks);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globalParks) {
      setParks(globalParks);
      setLoading(false);
      return;
    }

    if (!globalPromise) {
      globalPromise = buildParks();
    }

    globalPromise
      .then(data => {
        globalParks = data;
        setParks(data);
        setLoading(false);
      })
      .catch(err => {
        globalPromise = null; // allow retry
        setError(err.message || 'Failed to load parks');
        setLoading(false);
      });
  }, []);

  return { parks, loading, error };
}
