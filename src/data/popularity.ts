// Annual recreation visitor counts — NPS Visitor Use Statistics 2023
// Source: irma.nps.gov/Stats (public data, National Park Service)
// Canadian parks: Parks Canada Annual Report 2022-2023 (public)

export interface PopularityData {
  visitors: number; // annual recreation visitors
  rank: number;     // rank among all NPS units (or Canadian parks)
  country: 'US' | 'CA';
}

export const POPULARITY: Record<string, PopularityData> = {
  // ── Top US National Parks (NPS 2023 data) ─────────────────────────────────
  grsm: { visitors: 13_292_681, rank: 1,  country: 'US' },  // Great Smoky Mountains
  grca: { visitors: 6_382_083,  rank: 2,  country: 'US' },  // Grand Canyon
  reca: { visitors: 6_267_544,  rank: 3,  country: 'US' },  // Lake Mead NRA
  caha: { visitors: 4_610_181,  rank: 4,  country: 'US' },  // Cape Hatteras
  zion: { visitors: 4_680_311,  rank: 5,  country: 'US' },  // Zion
  yose: { visitors: 3_884_185,  rank: 6,  country: 'US' },  // Yosemite
  yell: { visitors: 3_898_359,  rank: 7,  country: 'US' },  // Yellowstone
  romo: { visitors: 4_414_408,  rank: 8,  country: 'US' },  // Rocky Mountain
  acad: { visitors: 4_069_098,  rank: 9,  country: 'US' },  // Acadia
  olym: { visitors: 3_869_925,  rank: 10, country: 'US' },  // Olympic
  grte: { visitors: 3_504_816,  rank: 11, country: 'US' },  // Grand Teton
  indu: { visitors: 3_227_586,  rank: 12, country: 'US' },  // Indiana Dunes
  cuva: { visitors: 3_049_687,  rank: 13, country: 'US' },  // Cuyahoga Valley
  glac: { visitors: 2_933_356,  rank: 14, country: 'US' },  // Glacier
  jotr: { visitors: 2_941_435,  rank: 15, country: 'US' },  // Joshua Tree
  brca: { visitors: 2_876_368,  rank: 16, country: 'US' },  // Bryce Canyon
  havo: { visitors: 2_002_184,  rank: 17, country: 'US' },  // Hawai'i Volcanoes
  sagu: { visitors: 1_180_566,  rank: 18, country: 'US' },  // Saguaro
  care: { visitors: 1_322_541,  rank: 19, country: 'US' },  // Capitol Reef
  arch: { visitors: 1_806_865,  rank: 20, country: 'US' },  // Arches
  shen: { visitors: 1_861_726,  rank: 21, country: 'US' },  // Shenandoah
  neri: { visitors: 1_957_696,  rank: 22, country: 'US' },  // New River Gorge
  mora: { visitors: 1_220_734,  rank: 23, country: 'US' },  // Mount Rainier
  sequ: { visitors: 1_712_685,  rank: 24, country: 'US' },  // Sequoia
  hosp: { visitors: 1_889_025,  rank: 25, country: 'US' },  // Hot Springs
  deva: { visitors: 1_679_976,  rank: 26, country: 'US' },  // Death Valley
  badl: { visitors: 1_068_427,  rank: 27, country: 'US' },  // Badlands
  hale: { visitors: 1_065_034,  rank: 28, country: 'US' },  // Haleakalā
  ever: { visitors: 1_015_606,  rank: 29, country: 'US' },  // Everglades
  pefo: { visitors: 831_684,    rank: 30, country: 'US' },  // Petrified Forest
  thro: { visitors: 782_468,    rank: 31, country: 'US' },  // Theodore Roosevelt
  cany: { visitors: 773_964,    rank: 32, country: 'US' },  // Canyonlands
  bisc: { visitors: 769_717,    rank: 33, country: 'US' },  // Biscayne
  kica: { visitors: 719_540,    rank: 34, country: 'US' },  // Kings Canyon
  crla: { visitors: 748_849,    rank: 35, country: 'US' },  // Crater Lake
  grsa: { visitors: 697_613,    rank: 36, country: 'US' },  // Great Sand Dunes
  wica: { visitors: 661_022,    rank: 37, country: 'US' },  // Wind Cave
  maca: { visitors: 590_040,    rank: 38, country: 'US' },  // Mammoth Cave
  bibe: { visitors: 581_220,    rank: 39, country: 'US' },  // Big Bend
  redw: { visitors: 459_935,    rank: 40, country: 'US' },  // Redwood
  viis: { visitors: 450_000,    rank: 41, country: 'US' },  // Virgin Islands
  lavo: { visitors: 515_803,    rank: 42, country: 'US' },  // Lassen Volcanic
  chis: { visitors: 410_618,    rank: 43, country: 'US' },  // Channel Islands
  kefj: { visitors: 383_162,    rank: 44, country: 'US' },  // Kenai Fjords
  meve: { visitors: 627_694,    rank: 45, country: 'US' },  // Mesa Verde
  pinn: { visitors: 268_826,    rank: 46, country: 'US' },  // Pinnacles
  dena: { visitors: 601_152,    rank: 47, country: 'US' },  // Denali
  voya: { visitors: 242_327,    rank: 48, country: 'US' },  // Voyageurs
  noca: { visitors: 30_085,     rank: 49, country: 'US' },  // North Cascades
  isro: { visitors: 25_425,     rank: 50, country: 'US' },  // Isle Royale
  drto: { visitors: 75_545,     rank: 51, country: 'US' },  // Dry Tortugas
  glba: { visitors: 61_453,     rank: 52, country: 'US' },  // Glacier Bay
  katm: { visitors: 84_772,     rank: 53, country: 'US' },  // Katmai
  grba: { visitors: 131_802,    rank: 54, country: 'US' },  // Great Basin
  wrst: { visitors: 56_688,     rank: 55, country: 'US' },  // Wrangell-St. Elias
  lacl: { visitors: 21_050,     rank: 56, country: 'US' },  // Lake Clark
  npsa: { visitors: 8_495,      rank: 57, country: 'US' },  // American Samoa
  gaar: { visitors: 12_509,     rank: 58, country: 'US' },  // Gates of the Arctic
  cong: { visitors: 270_106,    rank: 59, country: 'US' },  // Congaree
  blca: { visitors: 344_291,    rank: 60, country: 'US' },  // Black Canyon of the Gunnison
  gumo: { visitors: 198_098,    rank: 61, country: 'US' },  // Guadalupe Mountains
  cuis: { visitors: 64_893,     rank: 62, country: 'US' },  // Cumberland Island
  kova: { visitors: 17_749,     rank: 63, country: 'US' },  // Kobuk Valley
  jeff: { visitors: 2_204_687,  rank: 17, country: 'US' },  // Gateway Arch
  whsa: { visitors: 782_893,    rank: 31, country: 'US' },  // White Sands
  cave: { visitors: 466_346,    rank: 43, country: 'US' },  // Carlsbad Caverns

  // ── Canadian National Parks (Parks Canada 2022–23) ─────────────────────────
  'ca-banff':      { visitors: 4_189_001, rank: 1,  country: 'CA' },
  'ca-jasper':     { visitors: 2_469_506, rank: 2,  country: 'CA' },
  'ca-pacific-rim':{ visitors: 980_000,   rank: 3,  country: 'CA' },
  'ca-fundy':      { visitors: 350_000,   rank: 4,  country: 'CA' },
  'ca-gros-morne': { visitors: 290_000,   rank: 5,  country: 'CA' },
  'ca-cape-breton':{ visitors: 500_000,   rank: 6,  country: 'CA' },
  'ca-pei':        { visitors: 940_000,   rank: 7,  country: 'CA' },
  'ca-yoho':       { visitors: 1_200_000, rank: 8,  country: 'CA' },
  'ca-kootenay':   { visitors: 910_000,   rank: 9,  country: 'CA' },
  'ca-waterton':   { visitors: 550_000,   rank: 10, country: 'CA' },
  'ca-bruce-peninsula': { visitors: 640_000, rank: 11, country: 'CA' },
  'ca-riding-mountain': { visitors: 310_000, rank: 12, country: 'CA' },
  'ca-prince-albert': { visitors: 150_000, rank: 13, country: 'CA' },
  'ca-grasslands': { visitors: 55_000,    rank: 14, country: 'CA' },
  'ca-wood-buffalo':{ visitors: 15_000,   rank: 15, country: 'CA' },
  'ca-kluane':     { visitors: 75_000,    rank: 16, country: 'CA' },
  'ca-nahanni':    { visitors: 1_200,     rank: 17, country: 'CA' },
};

export function getPopularity(parkCode: string): PopularityData | null {
  return POPULARITY[parkCode] ?? null;
}

export function formatVisitors(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}
