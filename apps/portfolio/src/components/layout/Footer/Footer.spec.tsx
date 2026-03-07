import { cleanup, render, screen } from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('../../../utils/i18n');

import { useProfileStore } from '../../../stores/profile.store';
import Footer from './Footer';

afterEach(() => cleanup());

describe('Footer', () => {
  it('should render nothing when profile is null', () => {
    const { container } = render(<Footer />);

    expect(container.firstChild).toBeNull();
  });

  it('should render the footer when profile is set', () => {
    const profile = ProfileFactory.build();
    useProfileStore.setState({ profile });

    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render the copyright with the current year and user full name', () => {
    const profile = ProfileFactory.build();
    useProfileStore.setState({ profile });

    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(screen.getByText(year, { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(profile.user.fullName, { exact: false }),
    ).toBeInTheDocument();
  });

  it('should render social links for each network', () => {
    const profile = ProfileFactory.build();
    useProfileStore.setState({ profile });

    render(<Footer />);

    for (const network of profile.user.networks) {
      expect(screen.getByTitle(network.name).closest('a')).toHaveAttribute(
        'href',
        network.url,
      );
    }
  });

  it('should render the app version when VITE_APP_VERSION is set', () => {
    const profile = ProfileFactory.build();
    useProfileStore.setState({ profile });
    import.meta.env.VITE_APP_VERSION = '1.2.3';

    render(<Footer />);

    expect(screen.getByText(/v1\.2\.3/)).toBeInTheDocument();
  });

  it('should not render a version when VITE_APP_VERSION is not set', () => {
    const profile = ProfileFactory.build();
    useProfileStore.setState({ profile });
    import.meta.env.VITE_APP_VERSION = '';

    render(<Footer />);

    expect(screen.queryByText(/^v/)).toBeNull();
  });
});
