import type { Education } from 'my-profile-shared';

import { useInView } from '../../../hooks/useInView';
import { useAppStore } from '../../../stores/app.store';
import { formatDate } from '../../../utils/date';
import styles from './Resume.module.scss';

type EducationItemProps = {
  education: Education;
};

function EducationItem({ education }: EducationItemProps) {
  const locale = useAppStore((s) => s.locale);
  const { ref, inView: active } = useInView<HTMLDivElement>({
    rootMargin: '0px 0px -55% 0px',
  });

  return (
    <div
      ref={ref}
      className={`${styles.timelineItem}${active ? ` ${styles.active}` : ''}`}
    >
      <h4 className={styles.itemTitle}>{education.degree}</h4>
      <p className={styles.itemMeta}>
        <span className={styles.metaCompany}>{education.school}</span> &middot;{' '}
        <span>{education.city}</span>
      </p>
      <span className={styles.itemDate}>
        {formatDate(education.date, locale)}
      </span>
    </div>
  );
}

export default EducationItem;
