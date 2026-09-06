import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../hooks/useTheme';
import Icon from '../Icon/Icon';
import styles from './ThemeToggle.module.scss';

function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={t('navbar.toggleTheme')}
      aria-pressed={theme === 'dark'}
    >
      <Icon name={theme === 'dark' ? 'LuSun' : 'LuMoon'} />
    </button>
  );
}

export default ThemeToggle;
