import { useState } from 'react';
import type { NPSActivity } from '../../types/nps';
import styles from './ActivityTags.module.css';

const ICON_MAP: [string[], string][] = [
  [['hiking', 'backpacking', 'trail'], '🥾'],
  [['camping', 'backcountry camping'], '⛺'],
  [['swimming', 'snorkel', 'scuba'], '🏊'],
  [['fishing', 'fly fishing'], '🎣'],
  [['climbing', 'bouldering', 'rappelling'], '🧗'],
  [['wildlife', 'animal', 'bear'], '🦌'],
  [['bird', 'birding'], '🦅'],
  [['bike', 'biking', 'cycling', 'mountain biking'], '🚲'],
  [['kayak', 'canoe', 'paddling', 'rafting', 'rowing'], '🛶'],
  [['ski', 'skiing', 'snowshoe', 'cross-country'], '⛷️'],
  [['snow', 'snowmobile', 'sled'], '❄️'],
  [['horse', 'equestrian', 'mule'], '🐴'],
  [['star', 'astronomy', 'night sky'], '✦'],
  [['photo', 'photography'], '◎'],
  [['boat', 'sailing', 'motor'], '⛵'],
  [['picnic', 'food'], '☀'],
  [['visitor center', 'museum', 'exhibit', 'ranger'], '◈'],
  [['hunting', 'archery'], '◎'],
  [['off-road', 'atv', 'ohv', 'driving'], '◎'],
  [['geocach', 'letterbox'], '◉'],
  [['junior ranger'], '✦'],
  [['scenic', 'sightseeing', 'road'], '◎'],
];

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [keywords, icon] of ICON_MAP) {
    if (keywords.some(k => lower.includes(k))) return icon;
  }
  return '◈';
}

const INITIAL_SHOW = 12;

export default function ActivityTags({ activities }: { activities: NPSActivity[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!activities?.length) return null;

  const visible = expanded ? activities : activities.slice(0, INITIAL_SHOW);
  const extra = activities.length - INITIAL_SHOW;

  return (
    <div>
      <div className={styles.grid}>
        {visible.map(a => (
          <div key={a.id} className={styles.card}>
            <span className={styles.icon}>{getIcon(a.name)}</span>
            <span className={styles.label}>{a.name}</span>
          </div>
        ))}
      </div>
      {extra > 0 && (
        <button className={styles.expand} onClick={() => setExpanded(e => !e)}>
          {expanded ? '↑ Show less' : `+ ${extra} more activities`}
        </button>
      )}
    </div>
  );
}
