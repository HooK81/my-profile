import { useEffect, useState } from 'react';

import styles from './Loader.module.scss';

type LoaderProps = {
  isLoaded: boolean;
};

function Loader({ isLoaded }: LoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${isLoaded ? styles.fadeOut : ''}`}>
      <div className={styles.spinner}>
        <div className={styles.bounce1} />
        <div className={styles.bounce2} />
        <div className={styles.bounce3} />
      </div>
    </div>
  );
}

export default Loader;
