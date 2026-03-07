import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../../hooks/useProfileFileUrl');
vi.mock('../../ui/LocaleSwitcher/LocaleSwitcher', () => ({
  default: () => <div data-testid="locale-switcher" />,
}));

import { useProfileFileUrl } from '../../../hooks/useProfileFileUrl';
import { useAppStore } from '../../../stores/app.store';
import { useProfileStore } from '../../../stores/profile.store';
import Navbar from './Navbar';

const mockedUseProfileFileUrl = vi.mocked(useProfileFileUrl);

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">{`${location.pathname}${location.hash}`}</div>
  );
}

function renderNavbar(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => cleanup());

describe('Navbar', () => {
  beforeEach(() => {
    mockedUseProfileFileUrl.mockReturnValue(null);
  });

  it('should render a nav element', () => {
    renderNavbar();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the logo image when logoUrl is set', () => {
    const profile = useProfileStore.getState();
    useProfileStore.setState({
      ...profile,
      profile: {
        user: { fullName: 'John Doe', logo: 'logo.png' },
      } as never,
    });
    mockedUseProfileFileUrl.mockReturnValue('blob:logo-url');

    renderNavbar();

    expect(screen.getByRole('img')).toHaveAttribute('src', 'blob:logo-url');
  });

  it('should not render the logo image when logoUrl is null', () => {
    mockedUseProfileFileUrl.mockReturnValue(null);

    renderNavbar();

    expect(screen.queryByRole('img')).toBeNull();
  });

  it('should render all nav items', () => {
    renderNavbar();

    expect(screen.getByText('navbar.home')).toBeInTheDocument();
    expect(screen.getByText('navbar.aboutMe')).toBeInTheDocument();
    expect(screen.getByText('navbar.resume')).toBeInTheDocument();
    expect(screen.getByText('navbar.techs')).toBeInTheDocument();
    expect(screen.getByText('navbar.contact')).toBeInTheDocument();
    expect(screen.getByText('navbar.aboutThisSite')).toBeInTheDocument();
  });

  it('should toggle menu open when hamburger is clicked', () => {
    renderNavbar();

    const hamburger = screen.getByRole('button', {
      name: 'navbar.toggleMenu',
    });

    expect(hamburger).not.toHaveClass('open');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');
    fireEvent.click(hamburger);
    expect(hamburger).not.toHaveClass('open');
  });

  it('should close the menu when a nav item is clicked', () => {
    const el = document.createElement('div');
    el.id = 'about';
    document.body.appendChild(el);

    renderNavbar('/');

    const hamburger = screen.getByRole('button', { name: 'navbar.toggleMenu' });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');

    fireEvent.click(screen.getByText('navbar.aboutMe'));
    expect(hamburger).not.toHaveClass('open');

    document.body.removeChild(el);
  });

  it('should scroll to hero when the logo is clicked on the home page', () => {
    const el = document.createElement('div');
    el.id = 'hero';
    document.body.appendChild(el);

    const scrollIntoViewMock = vi.fn();
    el.scrollIntoView = scrollIntoViewMock;

    renderNavbar('/');
    fireEvent.click(screen.getAllByRole('button', { name: 'navbar.home' })[0]);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(el);
  });

  it('should scroll to the section when a section item is clicked on the home page', () => {
    const el = document.createElement('div');
    el.id = 'about';
    document.body.appendChild(el);

    const scrollIntoViewMock = vi.fn();
    el.scrollIntoView = scrollIntoViewMock;

    renderNavbar('/');
    fireEvent.click(screen.getByText('navbar.aboutMe'));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(el);
  });

  it('should navigate to /#section when a section item is clicked outside the home page', () => {
    renderNavbar('/about-this-site');

    fireEvent.click(screen.getByText('navbar.aboutMe'));

    expect(screen.getByTestId('location').textContent).toBe('/#about');
  });

  it('should navigate to the route when a route item is clicked', () => {
    renderNavbar('/');

    fireEvent.click(screen.getByText('navbar.aboutThisSite'));

    expect(screen.getByTestId('location').textContent).toBe('/about-this-site');
  });

  it('should not navigate when clicking the active route item', () => {
    renderNavbar('/about-this-site');

    fireEvent.click(screen.getByText('navbar.aboutThisSite'));

    expect(screen.getByTestId('location').textContent).toBe('/about-this-site');
  });

  it('should apply active class to the matching section when on home page', () => {
    useAppStore.setState({ activeSection: 'resume' });

    renderNavbar('/');

    expect(screen.getByText('navbar.resume')).toHaveClass('active');
  });

  it('should not apply active class to section items when not on home page', () => {
    useAppStore.setState({ activeSection: 'resume' });

    renderNavbar('/about-this-site');

    expect(screen.getByText('navbar.resume')).not.toHaveClass('active');
  });

  it('should apply active class to the matching route item', () => {
    renderNavbar('/about-this-site');

    expect(screen.getByText('navbar.aboutThisSite')).toHaveClass('active');
  });
});
