import { useTranslation } from 'react-i18next';

import Section from '../../components/layout/Section/Section';
import styles from './AboutThisSite.module.scss';

function AboutThisSite() {
  const { t } = useTranslation();

  return (
    <main className={styles.page}>
      <Section
        id="about-this-site"
        variant="primary"
        title={t('aboutThisSite.title')}
      >
        <p className={styles.intro}>{t('aboutThisSite.intro')}</p>

        <div className={styles.stack}>
          <div className={styles.row}>
            <h3 className={styles.title}>
              {t('aboutThisSite.frontend.title')}
            </h3>
            <div className={styles.details}>
              <h4 className={styles.category}>
                {t('aboutThisSite.frontend.category1.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.frontend.category1.items1')}</li>
              </ul>

              <h4 className={styles.category}>
                {t('aboutThisSite.frontend.category2.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.frontend.category2.items1')}</li>
                <li>{t('aboutThisSite.frontend.category2.items2')}</li>
                <li>{t('aboutThisSite.frontend.category2.items3')}</li>
                <li>{t('aboutThisSite.frontend.category2.items4')}</li>
              </ul>
            </div>
          </div>

          <div className={styles.row}>
            <h3 className={styles.title}>{t('aboutThisSite.backend.title')}</h3>
            <div className={styles.details}>
              <h4 className={styles.category}>
                {t('aboutThisSite.backend.category1.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.backend.category1.items1')}</li>
              </ul>

              <h4 className={styles.category}>
                {t('aboutThisSite.backend.category2.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.backend.category2.items1')}</li>
                <li>{t('aboutThisSite.backend.category2.items2')}</li>
                <li>{t('aboutThisSite.backend.category2.items3')}</li>
              </ul>
            </div>
          </div>

          <div className={styles.row}>
            <h3 className={styles.title}>
              {t('aboutThisSite.infrastructure.title')}
            </h3>
            <div className={styles.details}>
              <h4 className={styles.category}>
                {t('aboutThisSite.infrastructure.category1.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.infrastructure.category1.items1')}</li>
                <li>{t('aboutThisSite.infrastructure.category1.items2')}</li>
              </ul>
              <h4 className={styles.category}>
                {t('aboutThisSite.infrastructure.category2.title')}
              </h4>
              <ul>
                <li>{t('aboutThisSite.infrastructure.category2.items1')}</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

export default AboutThisSite;
