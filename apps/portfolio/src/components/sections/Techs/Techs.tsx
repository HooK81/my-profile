import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import Section from '../../layout/Section/Section';
import styles from './Techs.module.scss';

function Techs() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);

  if (!profile) {
    return null;
  }

  return (
    <Section id="techs" variant="primary" title={t('techs.title')}>
      <p className={styles.subtitle}>{t('techs.desc')}</p>
      <div className={styles.grid}>
        {profile.techs.map((tech) => (
          <div key={tech.name} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={`/images/techs/${tech.image}`} alt={tech.name} />
            </div>
            <h4 className={styles.name}>{tech.name}</h4>
            <p className={styles.desc}>{tech.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Techs;
