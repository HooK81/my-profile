import { cleanup, render, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('./ContactForm', () => ({
  default: () => <div data-testid="contact-form" />,
}));

import { useProfileStore } from '../../../stores/profile.store';
import { formatPhone } from '../../../utils/phone';
import Contact from './Contact';

afterEach(() => cleanup());

describe('Contact', () => {
  it('should render nothing when profile is null', () => {
    const { container } = render(<Contact />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile is set', () => {
    const profile = ProfileFactory.build();

    beforeEach(() => {
      useProfileStore.setState({ profile });
    });

    it('should render the section heading with contact title', () => {
      render(<Contact />);

      expect(
        screen.getByRole('heading', { level: 2, name: 'contact.title' }),
      ).toBeInTheDocument();
    });

    it('should display full address lines', () => {
      render(<Contact />);

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
      render(<Contact />);

      const emailLink = screen.getByRole('link', {
        name: profile.user.email,
      });
      expect(emailLink).toHaveAttribute('href', `mailto:${profile.user.email}`);
    });

    it('should display the phone as a tel link with formatted text', () => {
      render(<Contact />);

      const phoneLink = document.querySelector(
        `a[href="tel:${profile.user.phone!}"]`,
      );
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveTextContent(formatPhone(profile.user.phone!));
    });

    it('should not display the phone section when phone is undefined', () => {
      const noPhone = ProfileFactory.build({ user: { phone: undefined } });
      useProfileStore.setState({ profile: noPhone });

      render(<Contact />);

      expect(screen.queryByText('contact.phone')).not.toBeInTheDocument();
    });

    it('should render ContactForm', () => {
      render(<Contact />);

      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should omit empty address fields from rendered lines', () => {
      const partial = ProfileFactory.build({
        user: {
          address: { street: '', zip: '', city: 'Paris', country: 'France' },
        },
      });
      useProfileStore.setState({ profile: partial });

      render(<Contact />);

      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });

    it('should render only country when street, zip, and city are empty', () => {
      const countryOnly = ProfileFactory.build({
        user: {
          address: { street: '', zip: '', city: '', country: 'France' },
        },
      });
      useProfileStore.setState({ profile: countryOnly });

      render(<Contact />);

      expect(screen.getByText('France')).toBeInTheDocument();
      const spans = screen
        .getByText('France')
        .closest('p')!
        .querySelectorAll('span');
      expect(spans).toHaveLength(1);
    });
  });
});
