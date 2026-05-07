import type { IconName } from 'my-profile-shared';
import { useEffect, useRef, useState } from 'react';

import { useAppStore } from '../../../stores/app.store';
import Icon from '../../ui/Icon/Icon';
import styles from './Facts.module.scss';

type FactItemProps = {
  icon: IconName;
  value: number;
  label: string;
};

const DURATION_MS = 1500;

function FactItem({ icon, value, label }: FactItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useAppStore((s) => s.locale);
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(0);

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

  useEffect(() => {
    if (!visible) {
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      const eased = t * (2 - t);
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
      <Icon name={icon} className={styles.icon} />
      <div className={styles.value}>{display.toLocaleString(locale)}+</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default FactItem;
