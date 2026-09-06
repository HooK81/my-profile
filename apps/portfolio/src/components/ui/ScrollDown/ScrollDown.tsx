import { useTranslation } from 'react-i18next';

import Icon from '../Icon/Icon';
import styles from './ScrollDown.module.scss';

function ScrollDown({ href }: { href: string }) {
  const { t } = useTranslation();

  return (
    <div className={styles.scrollDown}>
      <a href={href} className={styles.scrollDownLink}>
        <div className={styles.scrollTitle}>{t('scrollDown.label')}</div>
        <Icon name="LuChevronDown" className={styles.chevron} />
      </a>
    </div>
  );
}

export default ScrollDown;
