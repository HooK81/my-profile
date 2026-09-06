vi.mock('zustand');

const { i18nMock, toLocaleMock } = vi.hoisted(() => ({
  i18nMock: {
    isInitialized: false,
    on: vi.fn(),
  },
  toLocaleMock: vi.fn().mockReturnValue('en'),
}));

vi.mock('i18next');

vi.mock('../utils/i18n', () => ({
  default: i18nMock,
  toLocale: toLocaleMock,
}));

import { useAppStore } from './app.store';

// Capture the initialized callback registered during module load
const initializedCallback = i18nMock.on.mock.calls.find(
  ([event]: string[]) => event === 'initialized',
)?.[1] as () => void;

describe('useAppStore', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    i18nMock.isInitialized = false;
    window.localStorage.clear();
  });

  describe('initial state', () => {
    it('should have correct defaults', () => {
      const state = useAppStore.getState();

      expect(state.i18nReady).toBe(false);
      expect(state.locale).toBe('en');
      expect(state.activeSection).toBe('hero');
      expect(state.theme).toBe('dark');
    });

    it('should register i18n initialized listener when not yet initialized', () => {
      expect(initializedCallback).toBeInstanceOf(Function);
    });
  });

  describe('i18n initialized callback', () => {
    it('should set i18nReady and locale when i18n fires initialized', () => {
      initializedCallback();

      const state = useAppStore.getState();
      expect(state.i18nReady).toBe(true);
    });
  });

  describe('changeLocale()', () => {
    it('should update locale', () => {
      useAppStore.getState().changeLocale('fr');

      expect(useAppStore.getState().locale).toBe('fr');
    });
  });

  describe('setActiveSection()', () => {
    it('should update activeSection', () => {
      useAppStore.getState().setActiveSection('about');

      expect(useAppStore.getState().activeSection).toBe('about');
    });
  });

  describe('toggleTheme()', () => {
    it('should switch from dark to light and persist the choice', () => {
      useAppStore.getState().toggleTheme();

      expect(useAppStore.getState().theme).toBe('light');
      expect(window.localStorage.getItem('portfolio-theme')).toBe('light');
    });

    it('should switch back to dark on a second toggle', () => {
      useAppStore.getState().toggleTheme();
      useAppStore.getState().toggleTheme();

      expect(useAppStore.getState().theme).toBe('dark');
      expect(window.localStorage.getItem('portfolio-theme')).toBe('dark');
    });
  });

  describe('when i18n is already initialized', () => {
    it('should not register i18n initialized listener', async () => {
      i18nMock.isInitialized = true;

      await import('./app.store');

      expect(i18nMock.on).not.toHaveBeenCalled();
    });
  });
});
