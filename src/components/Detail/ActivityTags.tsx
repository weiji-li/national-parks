import type { NPSActivity } from '../../types/nps';
import styles from './ActivityTags.module.css';

interface Props {
  activities: NPSActivity[];
}

export default function ActivityTags({ activities }: Props) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {activities.map(a => (
        <span key={a.id} className={styles.tag}>{a.name}</span>
      ))}
    </div>
  );
}
