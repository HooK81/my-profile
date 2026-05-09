import { act, cleanup, render, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../../hooks/useInView');

import { setInView } from '../../../hooks/__mocks__/useInView';
import { useAppStore } from '../../../stores/app.store';
import { useProfileStore } from '../../../stores/profile.store';
import Facts from './Facts';

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

    it('should render an svg icon for each fact', () => {
      const { container } = render(<Facts />);

      expect(container.querySelectorAll('svg')).toHaveLength(4);
    });

    it('should display 0+ before the section is observed', () => {
      render(<Facts />);

      expect(screen.getAllByText('0+')).toHaveLength(4);
    });

    it('should animate values up to their targets when observed', () => {
      vi.useFakeTimers();
      const facts = {
        linesOfCode: 1_287_065,
        mergeRequests: 483,
        trainings: 8,
        coffees: 1_275,
      };
      useProfileStore.setState({
        profile: ProfileFactory.build({ user: { facts } }),
      });

      render(<Facts />);

      setInView(true);
      act(() => {
        vi.advanceTimersByTime(2_100);
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
