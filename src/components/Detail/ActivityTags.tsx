import type { NPSActivity } from '../../types/nps';
import styles from './ActivityTags.module.css';

const ICON_MAP: [string[], string][] = [
  [['hiking', 'backpacking', 'trail'], '🥾'],
  [['camping', 'backcountry camping'], '⛺'],
  [['swimming', 'snorkel', 'scuba', 'diving'], '🏊'],
  [['fishing', 'fly fishing'], '🎣'],
  [['climbing', 'bouldering', 'rappelling'], '🧗'],
  [['wildlife', 'birding', 'bird watching'], '🦌'],
  [['bike', 'biking', 'cycling', 'mountain biking'], '🚲'],
  [['kayak', 'canoe', 'paddling', 'rafting', 'rowing'], '🛶'],
  [['ski', 'skiing', 'snowshoe', 'cross-country'], '⛷️'],
  [['snowmobile', 'sled'], '❄️'],
  [['horse', 'equestrian'], '🐴'],
  [['boat', 'sailing', 'motor'], '⛵'],
  [['scenic driving', 'scenic'], '🏔️'],
  [['surfing', 'paddleboard'], '🏄'],
];

// Each category: [display name, keywords that match, icon]
const CATEGORIES: [string, string[], string][] = [
  ['Hiking',           ['hiking', 'backpack', 'trail'],                '🥾'],
  ['Wildlife Watching',['wildlife watching', 'wildlife viewing'],      '🦌'],
  ['Birding',          ['birding', 'bird watching'],                   '🦅'],
  ['Fishing',          ['fishing'],                                    '🎣'],
  ['Rock Climbing',    ['climbing', 'bouldering', 'rappelling'],       '🧗'],
  ['Camping',          ['camping'],                                    '⛺'],
  ['Swimming',         ['swimming', 'snorkel', 'diving', 'scuba'],     '🏊'],
  ['Kayaking',         ['kayak', 'canoe', 'rafting', 'paddling'],      '🛶'],
  ['Skiing',           ['skiing', 'snowshoe', 'cross-country ski'],    '⛷️'],
  ['Snowmobiling',     ['snowmobile', 'sled'],                         '❄️'],
  ['Horseback Riding', ['horseback', 'equestrian'],                    '🐴'],
  ['Scenic Driving',   ['scenic driving'],                             '🏔️'],
  ['Boating',          ['sailing', 'boating', 'motor'],                '⛵'],
  ['Surfing',          ['surfing', 'paddleboard'],                     '🏄'],
];

export default function ActivityTags({ activities }: { activities: NPSActivity[] }) {
  if (!activities?.length) return null;
  const names = activities.map(a => a.name.toLowerCase());

  const matched = CATEGORIES.filter(([, keywords]) =>
    keywords.some(k => names.some(n => n.includes(k)))
  );
  if (!matched.length) return null;

  return (
    <div className={styles.grid}>
      {matched.map(([label, , icon]) => (
        <div key={label} className={styles.card}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
