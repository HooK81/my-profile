import { useEffect } from 'react';

import { useAppStore } from '../stores/app.store';
import { useAppReady } from './useAppReady';

const SECTIONS = ['hero', 'about', 'resume', 'techs', 'hobbies', 'contact'];

export function useMenuScrollSpy() {
  const isReady = useAppReady();
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [isReady, setActiveSection]);
}
