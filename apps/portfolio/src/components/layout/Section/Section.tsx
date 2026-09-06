import type { ReactNode } from 'react';

import styles from './Section.module.scss';

type SectionProps = {
  id: string;
  title?: string;
  index?: string;
  description?: string;
  variant: 'primary' | 'secondary';
  className?: string;
  children: ReactNode;
};

function Section({
  id,
  title,
  index,
  description,
  variant,
  className,
  children,
}: SectionProps) {
  const classes = [styles.section, styles[variant], className]
    .filter(Boolean)
    .join(' ');
  const headerClasses = [styles.header, description && styles.hasDescription]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes}>
      <div className={styles.container}>
        {title && (
          <div className={headerClasses}>
            {index && (
              <span className={styles.index} aria-hidden="true">
                {index}
              </span>
            )}
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </section>
  );
}

export default Section;
