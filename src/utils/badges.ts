import type { EnrichedPark as NPSPark } from '../hooks/useParks';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const NATIONAL_PARK_DESIGNATION = 'National Park';

function getVisitSeason(dateStr: string): string {
  const month = new Date(dateStr).getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function computeBadges(
  visits: Record<string, { parkCode: string; dates: string[]; notes: string }>,
  parks: NPSPark[]
): Badge[] {
  const visitedCodes = new Set(Object.keys(visits));
  const visitedCount = visitedCodes.size;

  const parksByCode = new Map(parks.map(p => [p.parkCode, p]));

  // All 63 designated National Parks
  const nationalParks = parks.filter(p => p.designation === NATIONAL_PARK_DESIGNATION);
  const visitedNationalParks = nationalParks.filter(p => visitedCodes.has(p.parkCode));

  // States visited
  const visitedStates = new Set<string>();
  for (const code of visitedCodes) {
    const park = parksByCode.get(code);
    if (park?.states) {
      park.states.split(',').forEach(s => visitedStates.add(s.trim()));
    }
  }

  // Pacific crest states
  const pacificStates = ['CA', 'OR', 'WA'];
  const pacificParks = parks.filter(p =>
    p.states.split(',').some(s => pacificStates.includes(s.trim()))
  );
  const visitedPacific = pacificParks.filter(p => visitedCodes.has(p.parkCode));

  // Seasons
  const seasons = new Set<string>();
  for (const visit of Object.values(visits)) {
    for (const date of visit.dates) {
      seasons.add(getVisitSeason(date));
    }
  }

  // Alaska parks
  const alaskaParks = parks.filter(p => p.states.includes('AK'));
  const visitedAlaska = alaskaParks.filter(p => visitedCodes.has(p.parkCode));

  return [
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Visit your first national park',
      icon: '🥾',
      unlocked: visitedCount >= 1,
    },
    {
      id: 'trailblazer',
      name: 'Trailblazer',
      description: 'Visit 10 parks',
      icon: '🌲',
      unlocked: visitedCount >= 10,
    },
    {
      id: 'explorer',
      name: 'Explorer',
      description: 'Visit 25 parks',
      icon: '🧭',
      unlocked: visitedCount >= 25,
    },
    {
      id: 'pilgrim',
      name: 'Pilgrim',
      description: 'Visit 50 parks',
      icon: '⛺',
      unlocked: visitedCount >= 50,
    },
    {
      id: 'centennial',
      name: 'Centennial',
      description: 'Visit 100 parks',
      icon: '🏔️',
      unlocked: visitedCount >= 100,
    },
    {
      id: 'all_seasons',
      name: 'All Seasons',
      description: 'Visit a park in every season',
      icon: '🍂',
      unlocked: seasons.size >= 4,
    },
    {
      id: 'pacific_crest',
      name: 'Pacific Crest',
      description: `Visit all parks in CA, OR & WA (${visitedPacific.length}/${pacificParks.length})`,
      icon: '🌊',
      unlocked: pacificParks.length > 0 && visitedPacific.length >= pacificParks.length,
    },
    {
      id: 'grand_slam',
      name: 'Grand Slam',
      description: `Visit all 63 National Parks (${visitedNationalParks.length}/${nationalParks.length})`,
      icon: '🦅',
      unlocked: nationalParks.length > 0 && visitedNationalParks.length >= nationalParks.length,
    },
    {
      id: 'frontier',
      name: 'Last Frontier',
      description: `Visit a park in Alaska (${visitedAlaska.length}/${alaskaParks.length})`,
      icon: '🐻',
      unlocked: visitedAlaska.length >= 1,
    },
    {
      id: 'cartographer',
      name: 'Cartographer',
      description: 'Visit parks in 10 different states',
      icon: '🗺️',
      unlocked: visitedStates.size >= 10,
    },
  ];
}
