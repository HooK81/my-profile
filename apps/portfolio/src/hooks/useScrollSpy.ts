import { useEffect } from 'react';

import { useAppStore } from '../stores/app.store';

const SECTIONS = ['hero', 'about', 'resume', 'techs', 'hobbies', 'contact'];

export function useScrollSpy() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setActiveSection = useAppStore((s) => s.setActiveSection);

  useEffect(() => {
    if (!isLoaded) {
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
  }, [isLoaded, setActiveSection]);
}
