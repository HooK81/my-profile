import { cleanup, fireEvent, screen } from '@testing-library/react';
import type { Profile } from 'my-profile-shared';
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';
import { MemoryRouter, useLocation } from 'react-router-dom';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');
vi.mock('../../ui/LocaleSwitcher/LocaleSwitcher', () => ({
  default: ({
    layout,
    onChange,
  }: {
    layout: string;
    onChange?: (locale: string) => void;
  }) => (
    <button
      data-testid={`locale-switcher-${layout}`}
      onClick={() => onChange?.('fr')}
    />
  ),
}));

import { useAppStore } from '../../../stores/app.store';
import { renderWithQueryClient } from '../../../test-utils';
import Navbar from './Navbar';

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">{`${location.pathname}${location.hash}`}</div>
  );
}

function renderNavbar(initialPath = '/', profile?: Profile) {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
      <LocationDisplay />
    </MemoryRouter>,
    { profile },
  );
}

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => cleanup());

describe('Navbar', () => {
  it('should render a nav element', () => {
    renderNavbar();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the logo with the initials of the user full name', () => {
    renderNavbar(
      '/',
      ProfileFactory.build({ user: { fullName: 'Julien Crochet' } }),
    );

    expect(
      screen.getAllByRole('button', { name: 'navbar.home' })[0],
    ).toHaveTextContent('JC');
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

  it('should close the menu when a locale is picked from the panel', () => {
    renderNavbar();

    const hamburger = screen.getByRole('button', { name: 'navbar.toggleMenu' });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');

    fireEvent.click(screen.getByTestId('locale-switcher-inline'));

    expect(hamburger).not.toHaveClass('open');
  });

  it('should close the menu on a click outside the navbar', () => {
    renderNavbar();

    const hamburger = screen.getByRole('button', { name: 'navbar.toggleMenu' });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');

    fireEvent.mouseDown(document.body);

    expect(hamburger).not.toHaveClass('open');
  });

  it('should keep the menu open on a click inside the navbar', () => {
    renderNavbar();

    const hamburger = screen.getByRole('button', { name: 'navbar.toggleMenu' });
    fireEvent.click(hamburger);

    fireEvent.mouseDown(screen.getByText('navbar.techs'));

    expect(hamburger).toHaveClass('open');
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
