import { useTranslation } from 'react-i18next';

import styles from './ScrollDown.module.scss';

function ScrollDown({ href }: { href: string }) {
  const { t } = useTranslation();

  return (
    <div className={styles.scrollDown}>
      <a href={href} className={styles.scrollDownLink}>
        <div className={styles.scrollTitle}>{t('scrollDown.label')}</div>
        <div className={styles.scrollMouse}>
          <div className={styles.wheel} />
        </div>
      </a>
    </div>
  );
}

export default ScrollDown;
