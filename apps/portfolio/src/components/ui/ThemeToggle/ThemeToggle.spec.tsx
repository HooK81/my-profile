import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('zustand');
vi.mock('i18next');
vi.mock('react-i18next');
vi.mock('../../../utils/i18n');

import { useAppStore } from '../../../stores/app.store';
import ThemeToggle from './ThemeToggle';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('ThemeToggle', () => {
  it('should render a pressed toggle with an icon in dark mode', () => {
    useAppStore.setState({ theme: 'dark' });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'navbar.toggleTheme' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('should render an unpressed toggle in light mode', () => {
    useAppStore.setState({ theme: 'light' });

    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: 'navbar.toggleTheme' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('should toggle the theme on click', () => {
    useAppStore.setState({ theme: 'dark' });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'navbar.toggleTheme' }));

    expect(useAppStore.getState().theme).toBe('light');
    expect(
      screen.getByRole('button', { name: 'navbar.toggleTheme' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });
});
