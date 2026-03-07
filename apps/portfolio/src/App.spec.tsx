import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    ensureToken: vi.fn().mockResolvedValue(undefined),
    loadProfile: vi.fn(),
  },
}));

vi.mock('./api/Api', () => ({ default: apiMock }));

vi.mock('./components/layout/Layout/Layout', () => ({
  default: () => <div data-testid="layout" />,
}));

vi.mock('./components/layout/ScrollToTop/ScrollToTop', () => ({
  default: () => null,
}));

vi.mock('./components/ui/Loader/Loader', () => ({
  default: ({ isLoaded }: { isLoaded: boolean }) => (
    <div data-testid="loader" data-loaded={isLoaded} />
  ),
}));

vi.mock('./pages/Home/Home', () => ({
  default: () => <div data-testid="home" />,
}));

vi.mock('./pages/AboutThisSite/AboutThisSite', () => ({
  default: () => <div data-testid="about-this-site" />,
}));

vi.mock('zustand');
vi.mock('i18next');
vi.mock('./utils/i18n');

import App from './App';
import { useAppStore } from './stores/app.store';

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('when i18n is not ready', () => {
    beforeEach(() => {
      useAppStore.setState({ i18nReady: false, isLoaded: false });
    });

    it('should not call the api', () => {
      render(<App />);

      expect(apiMock.ensureToken).not.toHaveBeenCalled();
    });

    it('should render loader with isLoaded=false', () => {
      render(<App />);

      expect(screen.getByTestId('loader')).toHaveAttribute(
        'data-loaded',
        'false',
      );
    });

    it('should not render routes', () => {
      render(<App />);

      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
    });
  });

  describe('when i18n is ready', () => {
    const profile = ProfileFactory.build();

    beforeEach(() => {
      apiMock.loadProfile.mockResolvedValue(profile);
      useAppStore.setState({ i18nReady: true, isLoaded: false, locale: 'en' });
    });

    it('should call ensureToken', async () => {
      render(<App />);

      await waitFor(() => expect(apiMock.ensureToken).toHaveBeenCalledOnce());
    });

    it('should call loadProfile with current locale', async () => {
      render(<App />);

      await waitFor(() =>
        expect(apiMock.loadProfile).toHaveBeenCalledWith('en'),
      );
    });

    it('should set document title from profile', async () => {
      render(<App />);

      await waitFor(() =>
        expect(document.title).toBe(
          `${profile.user.fullName} - ${profile.user.occupation}`,
        ),
      );
    });

    it('should render routes once loaded', async () => {
      render(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('layout')).toBeInTheDocument(),
      );
    });

    it('should reload profile when locale changes', async () => {
      render(<App />);

      await waitFor(() =>
        expect(apiMock.loadProfile).toHaveBeenCalledWith('en'),
      );

      act(() => {
        useAppStore.setState({ locale: 'fr' });
      });

      await waitFor(() =>
        expect(apiMock.loadProfile).toHaveBeenCalledWith('fr'),
      );
    });
  });

  describe('when api fails', () => {
    beforeEach(() => {
      apiMock.ensureToken.mockRejectedValue(new Error('network error'));
      useAppStore.setState({ i18nReady: true, isLoaded: false });
    });

    it('should not render routes', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<App />);

      await waitFor(() => expect(consoleSpy).toHaveBeenCalled());

      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should log the error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<App />);

      await waitFor(() =>
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to init app',
          expect.any(Error),
        ),
      );

      consoleSpy.mockRestore();
    });
  });
});
