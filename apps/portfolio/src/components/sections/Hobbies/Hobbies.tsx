import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import Section from '../../layout/Section/Section';
import styles from './Hobbies.module.scss';

function Hobbies() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);

  if (!profile) {
    return null;
  }

  return (
    <Section id="hobbies" variant="secondary" title={t('hobbies.title')}>
      <p className={styles.subtitle}>{t('hobbies.desc')}</p>
      <div className={styles.grid}>
        {profile.hobbies.map((hobby) => (
          <div key={hobby.title} className={styles.card}>
            <img
              src={`/images/hobbies/${hobby.image}`}
              alt={hobby.title}
              className={styles.image}
            />
            <div className={styles.overlay}>
              <i className={hobby.icon} />
              <hr className={styles.divider} />
              <span className={styles.title}>{hobby.title}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Hobbies;
