import { useTranslation } from 'react-i18next';

import { useProfile } from '../../../hooks/useProfile';
import Section from '../../layout/Section/Section';
import styles from './Techs.module.scss';

function Techs() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <Section
      id="techs"
      variant="primary"
      index="03"
      title={t('techs.title')}
      description={t('techs.desc')}
    >
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
