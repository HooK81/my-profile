import { cleanup, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');

import { renderWithQueryClient } from '../../../test-utils';
import Techs from './Techs';

afterEach(() => cleanup());

describe('Techs', () => {
  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Techs />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile is set', () => {
    const profile = ProfileFactory.build();

    it('should render the section with its title and description', () => {
      const { container } = renderWithQueryClient(<Techs />, { profile });

      expect(container.querySelector('#techs')).not.toBeNull();
      expect(
        screen.getByRole('heading', { level: 2, name: 'techs.title' }),
      ).toBeInTheDocument();
      expect(screen.getByText('techs.desc')).toBeInTheDocument();
    });

    it('should render one card per tech with its logo, name and description', () => {
      renderWithQueryClient(<Techs />, { profile });

      profile.techs.forEach((tech) => {
        expect(screen.getByAltText(tech.name)).toHaveAttribute(
          'src',
          `/images/techs/${tech.image}`,
        );
        expect(
          screen.getByRole('heading', { level: 4, name: tech.name }),
        ).toBeInTheDocument();
        expect(screen.getByText(tech.desc)).toBeInTheDocument();
      });
    });
  });
});
