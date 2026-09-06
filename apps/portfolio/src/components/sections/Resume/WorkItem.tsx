import type { Work } from 'my-profile-shared';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { useInView } from '../../../hooks/useInView';
import { useAppStore } from '../../../stores/app.store';
import { calculateDuration, formatDate } from '../../../utils/date';
import styles from './Resume.module.scss';

type WorkItemProps = {
  work: Work;
};

function WorkItem({ work }: WorkItemProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const { ref, inView: active } = useInView<HTMLDivElement>({
    rootMargin: '-15% 0px -45% 0px',
  });
  const start = formatDate(work.date.start, locale);
  const end = work.date.end
    ? formatDate(work.date.end, locale)
    : t('resume.date.present');
  const duration = calculateDuration(
    work.date.start,
    work.date.end || undefined,
  );
  const dateRange = `${start} – ${end} (${duration})`;

  return (
    <div
      ref={ref}
      className={`${styles.timelineItem}${active ? ` ${styles.active}` : ''}`}
    >
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h4 className={styles.itemTitle}>{work.title}</h4>
          <span className={styles.itemDate}>{dateRange}</span>
        </div>
        <p className={styles.itemMeta}>
          <span className={styles.metaCompany}>{work.company}</span> &middot;{' '}
          <span>{work.city}</span>
        </p>
        <div className={styles.itemDesc}>
          <ReactMarkdown>{work.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default WorkItem;
