import { useTranslation } from 'react-i18next';

import { useProfile } from '../../../hooks/useProfile';
import Section from '../../layout/Section/Section';
import Icon from '../../ui/Icon/Icon';
import EducationItem from './EducationItem';
import styles from './Resume.module.scss';
import SkillBar from './SkillBar';
import WorkItem from './WorkItem';

function Resume() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  if (!profile) {
    return null;
  }

  const { resume } = profile;

  return (
    <Section
      id="resume"
      variant="secondary"
      index="02"
      title={t('resume.title')}
      className={styles.resume}
    >
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.block}>
        <h3 className={styles.columnTitle}>
          <span className={styles.chip}>
            <Icon name="LuRocket" />
          </span>
          {t('resume.experience')}
        </h3>
        <div className={styles.timeline}>
          {resume.works.map((work) => (
            <WorkItem
              key={`${work.title}-${work.company}-${work.date.start}`}
              work={work}
            />
          ))}
        </div>
      </div>

      {resume.educations.length > 0 && (
        <div className={styles.block}>
          <h3 className={styles.columnTitle}>
            <span className={styles.chip}>
              <Icon name="LuGraduationCap" />
            </span>
            {t('resume.education')}
          </h3>
          <div className={styles.educationGrid}>
            {resume.educations.map((edu) => (
              <EducationItem
                key={`${edu.school}-${edu.degree}-${edu.date}`}
                education={edu}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.skills}>
        <h3 className={`${styles.columnTitle} ${styles.skillsTitle}`}>
          <span className={styles.chip}>
            <Icon name="LuCode" />
          </span>
          {t('skills.title')}
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
