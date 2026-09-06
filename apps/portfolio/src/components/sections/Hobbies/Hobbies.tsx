import { useTranslation } from 'react-i18next';

import { useProfile } from '../../../hooks/useProfile';
import Section from '../../layout/Section/Section';
import Icon from '../../ui/Icon/Icon';
import styles from './Hobbies.module.scss';

function Hobbies() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <Section
      id="hobbies"
      variant="secondary"
      index="04"
      title={t('hobbies.title')}
      description={t('hobbies.desc')}
    >
      <div className={styles.grid}>
        {profile.hobbies.map((hobby) => (
          <div key={hobby.title} className={styles.card}>
            <img
              src={`/images/hobbies/${hobby.image}`}
              alt={hobby.title}
              className={styles.image}
            />
            <div className={styles.overlay} />
            <div className={styles.caption}>
              <Icon name={hobby.icon} />
              <span className={styles.title}>{hobby.title}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Hobbies;
