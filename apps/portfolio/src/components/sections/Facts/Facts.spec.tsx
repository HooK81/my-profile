import { act, cleanup, render, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');

import { useAppStore } from '../../../stores/app.store';
import { useProfileStore } from '../../../stores/profile.store';
import Facts from './Facts';

let observerCallbacks: IntersectionObserverCallback[] = [];

class ControlledIO {
  constructor(cb: IntersectionObserverCallback) {
    observerCallbacks.push(cb);
  }
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const intersect = () => {
  act(() => {
    for (const cb of observerCallbacks) {
      cb(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
};

beforeEach(() => {
  observerCallbacks = [];
  globalThis.IntersectionObserver =
    ControlledIO as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Facts', () => {
  it('should render nothing when profile is null', () => {
    const { container } = render(<Facts />);

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when user.facts is undefined', () => {
    const profile = ProfileFactory.build();
    profile.user.facts = undefined;
    useProfileStore.setState({ profile });

    const { container } = render(<Facts />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile.user.facts is set', () => {
    beforeEach(() => {
      useAppStore.setState({ locale: 'en' });
      useProfileStore.setState({ profile: ProfileFactory.build() });
    });

    it('should render the section with id="facts"', () => {
      const { container } = render(<Facts />);

      expect(container.querySelector('#facts')).not.toBeNull();
    });

    it('should render all four labels', () => {
      render(<Facts />);

      expect(screen.getByText('facts.linesOfCode')).toBeDefined();
      expect(screen.getByText('facts.mergeRequests')).toBeDefined();
      expect(screen.getByText('facts.trainings')).toBeDefined();
      expect(screen.getByText('facts.coffees')).toBeDefined();
    });

    it('should render the four font-awesome icons', () => {
      const { container } = render(<Facts />);

      expect(container.querySelector('.fa-code')).not.toBeNull();
      expect(container.querySelector('.fa-code-pull-request')).not.toBeNull();
      expect(container.querySelector('.fa-lightbulb')).not.toBeNull();
      expect(container.querySelector('.fa-mug-hot')).not.toBeNull();
    });

    it('should display 0+ before the section is observed', () => {
      render(<Facts />);

      expect(screen.getAllByText('0+')).toHaveLength(4);
    });

    it('should animate values up to their targets when observed', () => {
      vi.useFakeTimers();
      const facts = {
        linesOfCode: 1287065,
        mergeRequests: 483,
        trainings: 8,
        coffees: 1275,
      };
      useProfileStore.setState({
        profile: ProfileFactory.build({ user: { facts } }),
      });

      render(<Facts />);

      intersect();
      act(() => {
        vi.advanceTimersByTime(1600);
      });

      expect(
        screen.getByText(`${facts.linesOfCode.toLocaleString('en')}+`),
      ).toBeDefined();
      expect(
        screen.getByText(`${facts.mergeRequests.toLocaleString('en')}+`),
      ).toBeDefined();
      expect(
        screen.getByText(`${facts.trainings.toLocaleString('en')}+`),
      ).toBeDefined();
      expect(
        screen.getByText(`${facts.coffees.toLocaleString('en')}+`),
      ).toBeDefined();
    });
  });
});
