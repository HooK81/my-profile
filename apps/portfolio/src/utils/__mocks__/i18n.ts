export const toLocale = vi.fn().mockReturnValue('en');

export default {
  isInitialized: false,
  t: vi.fn(),
  on: vi.fn(),
  language: 'en',
};
