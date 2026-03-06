import type { Skill } from 'my-profile-shared';
import { useEffect, useRef, useState } from 'react';

import styles from './Resume.module.scss';

type SkillBarProps = {
  skill: Skill;
};

function SkillBar({ skill }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
