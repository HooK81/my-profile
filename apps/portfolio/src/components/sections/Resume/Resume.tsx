import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import Section from '../../layout/Section/Section';
import Icon from '../../ui/Icon/Icon';
import EducationItem from './EducationItem';
import styles from './Resume.module.scss';
import SkillBar from './SkillBar';
import WorkItem from './WorkItem';

function Resume() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  if (!profile) {
    return null;
  }

  const { resume } = profile;

  return (
    <Section id="resume" variant="secondary" title={t('resume.title')}>
      <div className={styles.experience}>
        <h3 className={styles.columnTitle}>
          <Icon name="LuRocket" /> {t('resume.experience')}
        </h3>
        {resume.works.map((work) => (
          <WorkItem key={`${work.company}-${work.date.start}`} work={work} />
        ))}
      </div>

      {resume.educations.length > 0 && (
        <div className={styles.education}>
          <h3 className={styles.columnTitle}>
            <Icon name="LuGraduationCap" /> {t('resume.education')}
          </h3>
          <div className={styles.educationGrid}>
            {resume.educations.map((edu) => (
              <EducationItem
                key={`${edu.school}-${edu.date}`}
                education={edu}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.skills}>
        <h3 className={styles.columnTitle}>
          <Icon name="LuCode" /> {t('skills.title')}
        </h3>
        <p className={styles.subtitle}>{t('skills.desc')}</p>
        <div className={styles.skillsGrid}>
          {resume.skills.map((skill) => (
            <SkillBar key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export default Resume;
