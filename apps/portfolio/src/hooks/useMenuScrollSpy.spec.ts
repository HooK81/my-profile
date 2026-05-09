import { cleanup, renderHook } from '@testing-library/react';

vi.mock('zustand');

import { useAppStore } from '../stores/app.store';
import { useMenuScrollSpy } from './useMenuScrollSpy';

const SECTIONS = ['hero', 'about', 'resume', 'techs', 'hobbies', 'contact'];

afterEach(() => cleanup());

describe('useMenuScrollSpy', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (
        this: {
          observe: typeof observeMock;
          disconnect: typeof disconnectMock;
        },
        callback: IntersectionObserverCallback,
      ) {
        observerCallback = callback;
        this.observe = observeMock;
        this.disconnect = disconnectMock;
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  function createSectionElements(ids: string[]) {
    for (const id of ids) {
      const el = document.createElement('section');
      el.id = id;
      document.body.appendChild(el);
    }
  }

  it('should not create observer when not loaded', () => {
    renderHook(() => useMenuScrollSpy());

    expect(IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should observe all section elements when loaded', () => {
    useAppStore.setState({ isLoaded: true });
    createSectionElements(SECTIONS);

    renderHook(() => useMenuScrollSpy());

    expect(observeMock).toHaveBeenCalledTimes(6);
    for (const id of SECTIONS) {
      expect(observeMock).toHaveBeenCalledWith(document.getElementById(id));
    }
  });

  it('should call setActiveSection when entry is intersecting', () => {
    useAppStore.setState({ isLoaded: true });
    createSectionElements(['hero']);

    renderHook(() => useMenuScrollSpy());

    observerCallback(
      [
        { isIntersecting: true, target: { id: 'about' } },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(useAppStore.getState().activeSection).toBe('about');
  });

  it('should ignore non-intersecting entries', () => {
    useAppStore.setState({ isLoaded: true });
    createSectionElements(['hero']);

    renderHook(() => useMenuScrollSpy());

    observerCallback(
      [
        { isIntersecting: false, target: { id: 'about' } },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(useAppStore.getState().activeSection).toBe('hero');
  });

  it('should disconnect observer on unmount', () => {
    useAppStore.setState({ isLoaded: true });

    const { unmount } = renderHook(() => useMenuScrollSpy());
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
