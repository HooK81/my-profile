import type { ReactNode } from 'react';

import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  title?: string;
  variant?: 'primary' | 'secondary' | 'darkest';
  className?: string;
  children: ReactNode;
};

function Section({
  id,
  title,
  variant = 'primary',
  className,
  children,
}: SectionProps) {
  const classes = [styles.section, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export default Section;
