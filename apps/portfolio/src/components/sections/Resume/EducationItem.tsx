import type { Education } from 'my-profile-shared';

import { useAppStore } from '../../../stores/app.store';
import { formatDate } from '../../../utils/date';
import styles from './Resume.module.scss';

type EducationItemProps = {
  education: Education;
};

function EducationItem({ education }: EducationItemProps) {
  const locale = useAppStore((s) => s.locale);

  return (
    <div className={styles.eduTile}>
      <span className={styles.eduDate}>
        {formatDate(education.date, locale)}
      </span>
      <h4 className={styles.eduDegree}>{education.degree}</h4>
      <p className={styles.eduMeta}>
        <span>{education.school}</span> &middot; <span>{education.city}</span>
      </p>
    </div>
  );
}

export default EducationItem;
