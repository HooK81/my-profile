import { cleanup, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');

import { renderWithQueryClient } from '../../../test-utils';
import Hobbies from './Hobbies';

afterEach(() => cleanup());

describe('Hobbies', () => {
  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Hobbies />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile is set', () => {
    const profile = ProfileFactory.build();

    it('should render the section with its title and description', () => {
      const { container } = renderWithQueryClient(<Hobbies />, { profile });

      expect(container.querySelector('#hobbies')).not.toBeNull();
      expect(
        screen.getByRole('heading', { level: 2, name: 'hobbies.title' }),
      ).toBeInTheDocument();
      expect(screen.getByText('hobbies.desc')).toBeInTheDocument();
    });

    it('should render one tile per hobby with its image, icon and title', () => {
      const { container } = renderWithQueryClient(<Hobbies />, { profile });

      profile.hobbies.forEach((hobby) => {
        expect(screen.getByAltText(hobby.title)).toHaveAttribute(
          'src',
          `/images/hobbies/${hobby.image}`,
        );
        expect(screen.getByText(hobby.title)).toBeInTheDocument();
      });
      expect(container.querySelectorAll('svg')).toHaveLength(
        profile.hobbies.length,
      );
    });
  });
});
