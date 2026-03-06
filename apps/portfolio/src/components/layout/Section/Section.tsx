import type { ReactNode } from 'react';

import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  title?: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
};

function Section({ id, title, variant = 'primary', children }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${styles[variant]}`}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export default Section;
