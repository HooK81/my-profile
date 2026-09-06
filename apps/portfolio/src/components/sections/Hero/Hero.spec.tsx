import { cleanup, screen } from '@testing-library/react';
import type { Container, Engine, ISourceOptions } from '@tsparticles/engine';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';
import type { ReactNode } from 'react';

type ParticlesLoaded = (container?: Container) => Promise<void> | void;

const {
  typedMock,
  typedDestroyMock,
  loadSlimMock,
  fakeEngine,
  particlesLoaded,
} = vi.hoisted(() => {
  const typedDestroyMock = vi.fn();
  const typedMock = vi.fn(function () {
    return { destroy: typedDestroyMock };
  });
  return {
    typedMock,
    typedDestroyMock,
    loadSlimMock: vi.fn().mockResolvedValue(undefined),
    fakeEngine: {} as Engine,
    particlesLoaded: { current: undefined as ParticlesLoaded | undefined },
  };
});

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('typed.js', () => ({ default: typedMock }));
vi.mock('@tsparticles/slim', () => ({ loadSlim: loadSlimMock }));
vi.mock('@tsparticles/react', () => ({
  default: ({
    options,
    particlesLoaded: onLoaded,
  }: {
    options: ISourceOptions;
    particlesLoaded?: ParticlesLoaded;
  }) => {
    particlesLoaded.current = onLoaded;
    return (
      <div data-testid="particles" data-options={JSON.stringify(options)} />
    );
  },
  ParticlesProvider: ({
    init,
    children,
  }: {
    init: (engine: Engine) => Promise<void>;
    children: ReactNode;
  }) => {
    void init(fakeEngine);
    return <>{children}</>;
  },
}));

import { useAppStore } from '../../../stores/app.store';
import { renderWithQueryClient } from '../../../test-utils';
import Hero from './Hero';

afterEach(() => {
  cleanup();
  typedMock.mockClear();
  typedDestroyMock.mockClear();
});

describe('Hero', () => {
  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Hero />);

    expect(container.firstChild).toBeNull();
    expect(typedMock).not.toHaveBeenCalled();
  });

  describe('when profile is set', () => {
    const intro = 'Specialist of';
    const boldWord = 'web technologies';
    const profile = ProfileFactory.build({
      user: { description: `${intro} **${boldWord}**` },
    });

    it('should render the section with id="hero"', () => {
      const { container } = renderWithQueryClient(<Hero />, { profile });

      expect(container.querySelector('#hero')).not.toBeNull();
    });

    it('should render the full name as the main heading', () => {
      renderWithQueryClient(<Hero />, { profile });

      expect(
        screen.getByRole('heading', { level: 1, name: profile.user.fullName }),
      ).toBeInTheDocument();
    });

    it('should render the intro label and the markdown description', () => {
      renderWithQueryClient(<Hero />, { profile });

      expect(screen.getByText(/hero.iAmA/)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(intro))).toBeInTheDocument();
      expect(screen.getByText(boldWord).tagName).toBe('STRONG');
    });

    it('should load the slim tsparticles bundle into the engine', () => {
      renderWithQueryClient(<Hero />, { profile });

      expect(loadSlimMock).toHaveBeenCalledWith(fakeEngine);
    });

    it('should destroy a particles container superseded by a later load', async () => {
      renderWithQueryClient(<Hero />, { profile });
      const first = { destroy: vi.fn() } as unknown as Container;
      const second = { destroy: vi.fn() } as unknown as Container;

      await particlesLoaded.current?.(first);
      await particlesLoaded.current?.(first);
      expect(first.destroy).not.toHaveBeenCalled();

      await particlesLoaded.current?.(second);
      expect(first.destroy).toHaveBeenCalledTimes(1);
      expect(second.destroy).not.toHaveBeenCalled();
    });

    it('should render a scroll-down link to the about section', () => {
      renderWithQueryClient(<Hero />, { profile });

      expect(screen.getByRole('link')).toHaveAttribute('href', '#about');
    });

    it('should type the occupation and the city', () => {
      renderWithQueryClient(<Hero />, { profile });

      expect(typedMock).toHaveBeenCalledWith(
        expect.any(HTMLSpanElement),
        expect.objectContaining({
          strings: [
            `${profile.user.occupation} hero.basedIn ${profile.user.address.city}`,
          ],
          loop: true,
          showCursor: false,
        }),
      );
    });

    it('should type only the occupation when the city is missing', () => {
      const noCity = ProfileFactory.build({
        user: { address: { street: '', city: '', zip: '', country: '' } },
      });

      renderWithQueryClient(<Hero />, { profile: noCity });

      expect(typedMock).toHaveBeenCalledWith(
        expect.any(HTMLSpanElement),
        expect.objectContaining({ strings: [noCity.user.occupation] }),
      );
    });

    it('should destroy the typed instance on unmount', () => {
      const { unmount } = renderWithQueryClient(<Hero />, { profile });

      unmount();

      expect(typedDestroyMock).toHaveBeenCalledTimes(1);
    });

    it('should use white particles in dark mode', () => {
      useAppStore.setState({ theme: 'dark' });

      renderWithQueryClient(<Hero />, { profile });

      const options = screen.getByTestId('particles').dataset.options!;
      expect(options).toContain('#ffffff');
      expect(options).not.toContain('#0f172a');
    });

    it('should use dark particles in light mode', () => {
      useAppStore.setState({ theme: 'light' });

      renderWithQueryClient(<Hero />, { profile });

      const options = screen.getByTestId('particles').dataset.options!;
      expect(options).toContain('#0f172a');
      expect(options).not.toContain('#ffffff');
    });
  });
});
