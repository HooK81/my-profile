import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../../api/Api');
vi.mock('../../../hooks/useProfileFileUrl');

import api from '../../../api/Api';
import { useProfileFileUrl } from '../../../hooks/useProfileFileUrl';
import { useAppStore } from '../../../stores/app.store';
import { useProfileStore } from '../../../stores/profile.store';
import About from './About';

const mockedUseProfileFileUrl = vi.mocked(useProfileFileUrl);
const mockedApi = vi.mocked(api);

afterEach(() => cleanup());

describe('About', () => {
  it('should render nothing when profile is null', () => {
    mockedUseProfileFileUrl.mockReturnValue(null);

    const { container } = render(<About />);

    expect(container.firstChild).toBeNull();
  });

  describe('when profile is set', () => {
    const profile = ProfileFactory.build();

    beforeEach(() => {
      mockedUseProfileFileUrl.mockReturnValue(null);
      useProfileStore.setState({ profile });
      useAppStore.setState({ locale: 'en' });
    });

    it('should render the profile image when url is available', () => {
      mockedUseProfileFileUrl.mockReturnValue('blob:http://localhost/image');

      render(<About />);

      const img = screen.getByAltText(profile.user.fullName);
      expect(img).toHaveAttribute('src', 'blob:http://localhost/image');
    });

    it('should not render the profile image when url is null', () => {
      render(<About />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should display the bio text', () => {
      render(<About />);

      expect(screen.getByText(profile.user.bio)).toBeInTheDocument();
    });

    it('should render social links for each network', () => {
      render(<About />);

      profile.user.networks.forEach((network) => {
        const link = screen.getByTitle(network.name);
        expect(link).toHaveAttribute('href', network.url);
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    it('should display the full name as a link', () => {
      render(<About />);

      expect(
        screen.getByRole('link', { name: profile.user.fullName }),
      ).toBeInTheDocument();
    });

    it('should display the email as a mailto link', () => {
      render(<About />);

      const emailLink = screen.getByRole('link', {
        name: profile.user.email,
      });
      expect(emailLink).toHaveAttribute('href', `mailto:${profile.user.email}`);
    });

    it('should display the location when city exists', () => {
      render(<About />);

      expect(screen.getByText(profile.user.address.city!)).toBeInTheDocument();
    });

    it('should not display the location when city is not set', () => {
      const noCity = ProfileFactory.build({
        user: { address: { street: '', city: '', zip: '', country: '' } },
      });
      useProfileStore.setState({ profile: noCity });

      render(<About />);

      expect(
        screen.queryByText('about.location', { exact: false }),
      ).not.toBeInTheDocument();
    });

    it('should display the phone as a tel link when phone exists', () => {
      render(<About />);

      expect(
        document.querySelector(`a[href="tel:${profile.user.phone!}"]`),
      ).toBeInTheDocument();
    });

    it('should not display the phone when phone is not set', () => {
      const noPhone = ProfileFactory.build({ user: { phone: undefined } });
      useProfileStore.setState({ profile: noPhone });

      render(<About />);

      expect(
        screen.queryByText('about.phone', { exact: false }),
      ).not.toBeInTheDocument();
    });

    it('should download the resume on button click', async () => {
      const blob = new Blob(['pdf']);
      mockedApi.getFile.mockResolvedValue(blob);
      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://localhost/resume');
      const revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => {});

      render(<About />);
      fireEvent.click(
        screen.getByRole('button', { name: /about.downloadResume/ }),
      );

      await waitFor(() => {
        expect(mockedApi.getFile).toHaveBeenCalledWith(
          'en',
          profile.user.resumePdf,
        );
      });
      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/resume',
      );

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
      clickSpy.mockRestore();
    });

    it('should download the vcard on name link click', async () => {
      const blob = new Blob(['vcard']);
      mockedApi.getVcard.mockResolvedValue(blob);
      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://localhost/vcard');
      const revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => {});

      render(<About />);
      fireEvent.click(
        screen.getByRole('link', { name: profile.user.fullName }),
      );

      await waitFor(() => {
        expect(mockedApi.getVcard).toHaveBeenCalledWith('en');
      });
      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/vcard',
      );

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
      clickSpy.mockRestore();
    });
  });
});
