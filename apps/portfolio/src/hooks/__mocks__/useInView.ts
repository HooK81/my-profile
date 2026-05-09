import { act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

const subscribers = new Set<(v: boolean) => void>();
let currentInView = false;

export const useInView = vi.fn(<T extends Element = HTMLDivElement>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(currentInView);

  useEffect(() => {
    subscribers.add(setInView);
    return () => {
      subscribers.delete(setInView);
    };
  }, []);

  return { ref, inView };
});

export const setInView = (value: boolean) => {
  currentInView = value;
  act(() => {
    subscribers.forEach((s) => s(value));
  });
};

afterEach(() => {
  currentInView = false;
  subscribers.clear();
});
