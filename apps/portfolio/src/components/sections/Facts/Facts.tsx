import type { Facts as FactsData } from 'my-profile-shared';
import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import Section from '../../layout/Section/Section';
import FactItem from './FactItem';
import styles from './Facts.module.scss';

const FACTS: { key: keyof FactsData; icon: string }[] = [
  { key: 'linesOfCode', icon: 'fa-solid fa-code' },
  { key: 'mergeRequests', icon: 'fa-solid fa-code-pull-request' },
  { key: 'trainings', icon: 'fa-regular fa-lightbulb' },
  { key: 'coffees', icon: 'fa-solid fa-mug-hot' },
];

function Facts() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);

  if (!profile?.user.facts) {
    return null;
  }

  const { facts } = profile.user;

  return (
    <Section id="facts" variant="darkest" className={styles.bg}>
      <div className={styles.grid}>
        {FACTS.map(({ key, icon }) => (
          <FactItem
            key={key}
            icon={icon}
            value={facts[key]}
            label={t(`facts.${key}`)}
          />
        ))}
      </div>
    </Section>
  );
}

export default Facts;
