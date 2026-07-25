import { useTranslation } from 'react-i18next';

import Button from '../Button/Button';
import styles from './AppError.module.scss';
import CryingCloud from './CryingCloud';

type AppErrorProps = {
  onRetry: () => void;
};

function AppError({ onRetry }: AppErrorProps) {
  const { t } = useTranslation();

  return (
    <div data-testid="app-error" className={styles.overlay} role="alert">
      <div className={styles.header}>
        <CryingCloud className={styles.illustration} />
        <h1 className={styles.title}>{t('error.title')}</h1>
      </div>

      <div className={styles.actions}>
        <p className={styles.message}>{t('error.tryAgainLater')}</p>
        <Button variant="filled" onClick={onRetry}>
          {t('error.retry')}
        </Button>
      </div>
    </div>
  );
}

export default AppError;
