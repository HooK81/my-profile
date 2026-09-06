import type { IconName } from 'my-profile-shared';
import { useEffect, useState } from 'react';

import { useInView } from '../../../hooks/useInView';
import { useAppStore } from '../../../stores/app.store';
import Icon from '../../ui/Icon/Icon';
import styles from './Facts.module.scss';

type FactItemProps = {
  icon: IconName;
  value: number;
  label: string;
};

const DURATION_MS = 1_800;

function FactItem({ icon, value, label }: FactItemProps) {
  const locale = useAppStore((s) => s.locale);
  const { ref, inView: visible } = useInView<HTMLDivElement>({
    threshold: 0.7,
    once: true,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(eased * value));
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [visible, value]);

  return (
    <div ref={ref} className={styles.item}>
      <div className={styles.iconChip}>
        <Icon name={icon} className={styles.icon} />
      </div>
      <div className={styles.value}>{display.toLocaleString(locale)}+</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default FactItem;
