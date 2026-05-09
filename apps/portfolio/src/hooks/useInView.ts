import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = IntersectionObserverInit & {
  once?: boolean;
};

export function useInView<T extends Element = HTMLDivElement>(
  options?: UseInViewOptions,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const { once, ...observerInit } = options ?? {};

    const observer = new IntersectionObserver(([entry]) => {
      if (once) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      } else {
        setInView(entry.isIntersecting);
      }
    }, observerInit);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
