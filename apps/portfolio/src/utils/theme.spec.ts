import { applyTheme, getInitialTheme, persistTheme } from './theme';

const STORAGE_KEY = 'portfolio-theme';

describe('theme utils', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete document.documentElement.dataset.theme;
  });

  describe('getInitialTheme()', () => {
    it('should return the stored theme when one is saved', () => {
      window.localStorage.setItem(STORAGE_KEY, 'light');

      expect(getInitialTheme()).toBe('light');
    });

    it('should ignore an invalid stored value', () => {
      window.localStorage.setItem(STORAGE_KEY, 'sepia');

      expect(getInitialTheme()).toBe('dark');
    });

    it('should follow a light system preference when nothing is stored', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

      expect(getInitialTheme()).toBe('light');
      expect(window.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: light)',
      );
    });

    it('should default to dark when the system prefers dark', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));

      expect(getInitialTheme()).toBe('dark');
    });

    it('should default to dark when matchMedia is unavailable', () => {
      expect(getInitialTheme()).toBe('dark');
    });

    it('should fall back to the system preference when storage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied');
      });
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

      expect(getInitialTheme()).toBe('light');
    });
  });

  describe('persistTheme()', () => {
    it('should save the theme to localStorage', () => {
      persistTheme('light');

      expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light');
    });

    it('should not throw when storage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('denied');
      });

      expect(() => persistTheme('dark')).not.toThrow();
    });
  });

  describe('applyTheme()', () => {
    it('should set data-theme on the root element', () => {
      applyTheme('light');

      expect(document.documentElement.dataset.theme).toBe('light');
    });
  });
});
