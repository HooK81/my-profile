import { act, cleanup, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../../hooks/useInView');

import { setInView } from '../../../hooks/__mocks__/useInView';
import { useAppStore } from '../../../stores/app.store';
import { renderWithQueryClient } from '../../../test-utils';
import Facts from './Facts';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Facts', () => {
  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Facts />);

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when user.facts is undefined', () => {
    const profile = ProfileFactory.build();
    profile.user.facts = undefined;

    const { container } = renderWithQueryClient(<Facts />, { profile });

    expect(container.firstChild).toBeNull();
  });

  describe('when profile.user.facts is set', () => {
    const profile = ProfileFactory.build();

    beforeEach(() => {
      useAppStore.setState({ locale: 'en' });
    });

    it('should render the section with id="facts"', () => {
      const { container } = renderWithQueryClient(<Facts />, { profile });

      expect(container.querySelector('#facts')).not.toBeNull();
    });

    it('should render all four labels', () => {
      renderWithQueryClient(<Facts />, { profile });

      expect(screen.getByText('facts.linesOfCode')).toBeDefined();
      expect(screen.getByText('facts.mergeRequests')).toBeDefined();
      expect(screen.getByText('facts.trainings')).toBeDefined();
      expect(screen.getByText('facts.coffees')).toBeDefined();
    });

    it('should render an svg icon for each fact', () => {
      const { container } = renderWithQueryClient(<Facts />, { profile });

      expect(container.querySelectorAll('svg')).toHaveLength(4);
    });

    it('should display 0+ before the section is observed', () => {
      renderWithQueryClient(<Facts />, { profile });

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

      renderWithQueryClient(<Facts />, {
        profile: ProfileFactory.build({ user: { facts } }),
      });

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
