import type { Facts as FactsData, IconName } from 'my-profile-shared';
import { useTranslation } from 'react-i18next';

import { useProfile } from '../../../hooks/useProfile';
import Section from '../../layout/Section/Section';
import FactItem from './FactItem';
import styles from './Facts.module.scss';

const FACTS: { key: keyof FactsData; icon: IconName }[] = [
  { key: 'linesOfCode', icon: 'LuCode' },
  { key: 'mergeRequests', icon: 'LuGitPullRequestArrow' },
  { key: 'trainings', icon: 'LuLightbulb' },
  { key: 'coffees', icon: 'LuCoffee' },
];

function Facts() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (!profile?.user.facts) {
    return null;
  }

  const { facts } = profile.user;

  return (
    <Section id="facts" variant="primary" className={styles.facts}>
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
