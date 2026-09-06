import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    ensureAuth: vi.fn().mockResolvedValue(undefined),
    loadProfile: vi.fn(),
  },
}));

vi.mock('./api/Api', () => ({ default: apiMock }));

vi.mock('./components/layout/Layout/Layout', async () => {
  const { Outlet } = await import('react-router-dom');
  return {
    default: () => (
      <div data-testid="layout">
        <Outlet />
      </div>
    ),
  };
});

vi.mock('./components/layout/ScrollToTop/ScrollToTop', () => ({
  default: () => null,
}));

vi.mock('./pages/Home/Home', () => ({
  default: () => <div data-testid="home" />,
}));

vi.mock('./pages/AboutThisSite/AboutThisSite', () => ({
  default: () => <div data-testid="about-this-site" />,
}));

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('./utils/i18n');

import App from './App';
import { useAppStore } from './stores/app.store';
import { renderWithQueryClient } from './test-utils';
import { getInitials } from './utils/initials';

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    window.history.pushState({}, '', '/');
    document.querySelector('link[rel="icon"]')?.remove();
  });

  describe('when i18n is not ready', () => {
    beforeEach(() => {
      useAppStore.setState({ i18nReady: false });
    });

    it('should not call the api', () => {
      renderWithQueryClient(<App />);

      expect(apiMock.ensureAuth).not.toHaveBeenCalled();
    });

    it('should render loader with isLoaded=false', () => {
      renderWithQueryClient(<App />);

      expect(screen.getByTestId('loader')).toHaveAttribute(
        'data-loaded',
        'false',
      );
    });

    it('should not render routes', () => {
      renderWithQueryClient(<App />);

      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
    });
  });

  describe('when i18n is ready', () => {
    const profile = ProfileFactory.build();

    beforeEach(() => {
      apiMock.loadProfile.mockResolvedValue(profile);
      useAppStore.setState({ i18nReady: true, locale: 'en' });
    });

    it('should call ensureAuth', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() => expect(apiMock.ensureAuth).toHaveBeenCalledOnce());
    });

    it('should call loadProfile with current locale', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(apiMock.loadProfile).toHaveBeenCalledWith('en'),
      );
    });

    it('should set document title from profile', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(document.title).toBe(
          `${profile.user.fullName} - ${profile.user.occupation}`,
        ),
      );
    });

    it('should set the favicon from the user initials', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() => {
        const link =
          document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        expect(link?.href).toContain('data:image/svg+xml');
        expect(decodeURIComponent(link!.href)).toContain(
          `>${getInitials(profile.user.fullName)}</text>`,
        );
      });
    });

    it('should render the home page once loaded', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('home')).toBeInTheDocument(),
      );
    });

    it('should render the about-this-site page on its route', async () => {
      window.history.pushState({}, '', '/about-this-site');

      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('about-this-site')).toBeInTheDocument(),
      );
      expect(screen.queryByTestId('home')).not.toBeInTheDocument();
    });

    it('should reload profile when locale changes', async () => {
      renderWithQueryClient(<App />);

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
    const profile = ProfileFactory.build();

    beforeEach(() => {
      apiMock.ensureAuth.mockRejectedValue(new Error('network error'));
      useAppStore.setState({ i18nReady: true, locale: 'en' });
    });

    it('should render the error screen', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('app-error')).toBeInTheDocument(),
      );
    });

    it('should not render the loader', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('app-error')).toBeInTheDocument(),
      );

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should not render routes', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('app-error')).toBeInTheDocument(),
      );

      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
    });

    it('should render the routes when retrying succeeds', async () => {
      renderWithQueryClient(<App />);

      await waitFor(() =>
        expect(screen.getByTestId('app-error')).toBeInTheDocument(),
      );

      apiMock.ensureAuth.mockResolvedValue(undefined);
      apiMock.loadProfile.mockResolvedValue(profile);
      fireEvent.click(screen.getByRole('button', { name: 'error.retry' }));

      await waitFor(() =>
        expect(screen.getByTestId('layout')).toBeInTheDocument(),
      );
      expect(screen.queryByTestId('app-error')).not.toBeInTheDocument();
    });
  });
});
