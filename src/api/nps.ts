import type { NPSApiResponse, NPSPark } from '../types/nps';

const BASE_URL = 'https://developer.nps.gov/api/v1';
const API_KEY = import.meta.env.VITE_NPS_API_KEY || 'DEMO_KEY';
const CACHE_KEY = 'nps_parks_v3';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

interface CacheEntry {
  data: NPSPark[];
  timestamp: number;
}

function getCache(): NPSPark[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: NPSPark[]): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full — skip caching silently
  }
}

export async function fetchAllParks(): Promise<NPSPark[]> {
  const cached = getCache();
  if (cached) return cached;

  // Single request with limit=500 to avoid rate-limit issues with DEMO_KEY.
  // The NPS API supports up to 500 per request and has ~471 total park units.
  const url = `${BASE_URL}/parks?limit=500&start=0&api_key=${API_KEY}&fields=images,activities,operatingHours,entranceFees,addresses`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`NPS API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json: NPSApiResponse = await res.json();

  if (!json.data) {
    const msg = (json as unknown as { error?: { message?: string } }).error?.message ?? 'Unknown error';
    throw new Error(`NPS API error: ${msg}`);
  }

  // If total > 500, fetch remaining pages (unlikely but safe)
  const total = parseInt(json.total, 10);
  let allParks = [...json.data];

  if (total > 500) {
    const remaining: Promise<NPSPark[]>[] = [];
    for (let start = 500; start < total; start += 500) {
      const u = `${BASE_URL}/parks?limit=500&start=${start}&api_key=${API_KEY}&fields=images,activities,operatingHours,entranceFees,addresses`;
      remaining.push(
        fetch(u)
          .then(r => r.json())
          .then((j: NPSApiResponse) => j.data ?? [])
          .catch(() => [])
      );
    }
    const extra = await Promise.all(remaining);
    allParks = allParks.concat(...extra);
  }

  const parks = allParks.filter(p => p.latitude && p.longitude && p.fullName);
  setCache(parks);
  return parks;
}

export function getParkImageUrl(park: NPSPark, index = 0): string {
  if (park.images?.length > index) return park.images[index].url;
  // NPS CDN fallback
  return `https://www.nps.gov/common/uploads/grid_builder/nps/crop1920x1054/${park.parkCode}.jpg`;
}

export function parseLatLong(park: NPSPark): [number, number] | null {
  const lat = parseFloat(park.latitude);
  const lng = parseFloat(park.longitude);
  if (isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
}

export function getStatesArray(park: NPSPark): string[] {
  return park.states ? park.states.split(',').map(s => s.trim()) : [];
}
