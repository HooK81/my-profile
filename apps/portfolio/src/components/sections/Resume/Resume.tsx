import { useTranslation } from 'react-i18next';

import { useProfileStore } from '../../../stores/profile.store';
import Section from '../../layout/Section/Section';
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
          <i className="fa-solid fa-rocket" /> {t('resume.experience')}
        </h3>
        {resume.works.map((work, i) => (
          <WorkItem key={i} work={work} />
        ))}
      </div>

      {resume.educations.length > 0 && (
        <div className={styles.education}>
          <h3 className={styles.columnTitle}>
            <i className="fa-solid fa-graduation-cap" /> {t('resume.education')}
          </h3>
          <div className={styles.educationGrid}>
            {resume.educations.map((edu, i) => (
              <EducationItem key={i} education={edu} />
            ))}
          </div>
        </div>
      )}

      <div className={styles.skills}>
        <h3 className={styles.columnTitle}>
          <i className="fa-solid fa-code" /> {t('skills.title')}
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
