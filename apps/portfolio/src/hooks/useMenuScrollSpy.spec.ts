import { cleanup, renderHook } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('../utils/i18n');

import { useAppStore } from '../stores/app.store';
import { createQueryWrapper } from '../test-utils';
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

  function renderScrollSpy(ready = true) {
    if (ready) {
      useAppStore.setState({ i18nReady: true });
    }

    return renderHook(() => useMenuScrollSpy(), {
      wrapper: createQueryWrapper(
        ready ? { profile: ProfileFactory.build() } : {},
      ),
    });
  }

  it('should not create observer when the app is not ready', () => {
    renderScrollSpy(false);

    expect(IntersectionObserver).not.toHaveBeenCalled();
  });

  it('should observe all section elements when loaded', () => {
    createSectionElements(SECTIONS);

    renderScrollSpy();

    expect(observeMock).toHaveBeenCalledTimes(6);
    for (const id of SECTIONS) {
      expect(observeMock).toHaveBeenCalledWith(document.getElementById(id));
    }
  });

  it('should call setActiveSection when entry is intersecting', () => {
    createSectionElements(['hero']);

    renderScrollSpy();

    observerCallback(
      [
        { isIntersecting: true, target: { id: 'about' } },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(useAppStore.getState().activeSection).toBe('about');
  });

  it('should ignore non-intersecting entries', () => {
    createSectionElements(['hero']);

    renderScrollSpy();

    observerCallback(
      [
        { isIntersecting: false, target: { id: 'about' } },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(useAppStore.getState().activeSection).toBe('hero');
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = renderScrollSpy();
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
