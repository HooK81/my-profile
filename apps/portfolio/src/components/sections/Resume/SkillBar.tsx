import type { Skill } from 'my-profile-shared';

import { useInView } from '../../../hooks/useInView';
import styles from './Resume.module.scss';

type SkillBarProps = {
  skill: Skill;
};

function SkillBar({ skill }: SkillBarProps) {
  const { ref, inView: visible } = useInView<HTMLDivElement>({
    threshold: 0.3,
    once: true,
  });

  return (
    <div ref={ref} className={styles.skillItem}>
      <div className={styles.skillHeader}>
        <span className={styles.skillName}>{skill.name}</span>
        {skill.showLevel && (
          <span className={styles.skillLevel}>{skill.level}%</span>
        )}
      </div>
      <div className={styles.skillTrack}>
        <div
          className={styles.skillFill}
          style={{ width: visible ? `${skill.level}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export default SkillBar;
