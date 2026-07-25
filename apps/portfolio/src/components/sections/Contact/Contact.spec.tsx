import { cleanup, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('./ContactForm', () => ({
  default: () => <div data-testid="contact-form" />,
}));

import { renderWithQueryClient } from '../../../test-utils';
import { formatPhone } from '../../../utils/phone';
import Contact from './Contact';

afterEach(() => cleanup());

describe('Contact', () => {
  it('should render nothing when profile is not loaded', () => {
    const { container } = renderWithQueryClient(<Contact />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile is set', () => {
    const profile = ProfileFactory.build();

    it('should render the section heading with contact title', () => {
      renderWithQueryClient(<Contact />, { profile });

      expect(
        screen.getByRole('heading', { level: 2, name: 'contact.title' }),
      ).toBeInTheDocument();
    });

    it('should display full address lines', () => {
      renderWithQueryClient(<Contact />, { profile });

      expect(
        screen.getByText(profile.user.address.street!),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `${profile.user.address.zip} ${profile.user.address.city}`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(profile.user.address.country!),
      ).toBeInTheDocument();
    });

    it('should display the email as a mailto link', () => {
      renderWithQueryClient(<Contact />, { profile });

      const emailLink = screen.getByRole('link', {
        name: profile.user.email,
      });
      expect(emailLink).toHaveAttribute('href', `mailto:${profile.user.email}`);
    });

    it('should display the phone as a tel link with formatted text', () => {
      renderWithQueryClient(<Contact />, { profile });

      const phoneLink = document.querySelector(
        `a[href="tel:${profile.user.phone!}"]`,
      );
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveTextContent(formatPhone(profile.user.phone!));
    });

    it('should not display the phone section when phone is undefined', () => {
      const noPhone = ProfileFactory.build({ user: { phone: undefined } });

      renderWithQueryClient(<Contact />, { profile: noPhone });

      expect(screen.queryByText('contact.phone')).not.toBeInTheDocument();
    });

    it('should render ContactForm', () => {
      renderWithQueryClient(<Contact />, { profile });

      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should omit empty address fields from rendered lines', () => {
      const partial = ProfileFactory.build({
        user: {
          address: { street: '', zip: '', city: 'Paris', country: 'France' },
        },
      });

      renderWithQueryClient(<Contact />, { profile: partial });

      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });

    it('should render only country when street, zip, and city are empty', () => {
      const countryOnly = ProfileFactory.build({
        user: {
          address: { street: '', zip: '', city: '', country: 'France' },
        },
      });

      renderWithQueryClient(<Contact />, { profile: countryOnly });

      expect(screen.getByText('France')).toBeInTheDocument();
      const spans = screen
        .getByText('France')
        .closest('p')!
        .querySelectorAll('span');
      expect(spans).toHaveLength(1);
    });
  });
});
