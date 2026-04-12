import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const { changeLanguageMock } = vi.hoisted(() => ({
  changeLanguageMock: vi.fn(),
}));

vi.mock('zustand');
vi.mock('../../../utils/i18n', () => ({
  default: {
    isInitialized: false,
    t: vi.fn(),
    on: vi.fn(),
    language: 'en',
    changeLanguage: changeLanguageMock,
  },
  toLocale: vi.fn().mockReturnValue('en'),
}));

import { useAppStore } from '../../../stores/app.store';
import LocaleSwitcher from './LocaleSwitcher';

afterEach(() => cleanup());

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    changeLanguageMock.mockReset();
    useAppStore.setState({ locale: 'en' });
  });

  describe('dropdown variant (default)', () => {
    it('should render the trigger with the active locale flag', () => {
      render(<LocaleSwitcher />);

      const trigger = screen.getByRole('button', { name: /▾/ });
      expect(trigger).toBeInTheDocument();
    });

    it('should open the menu on trigger click', () => {
      render(<LocaleSwitcher />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /▾/ }));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should close the menu on second trigger click', () => {
      render(<LocaleSwitcher />);

      const trigger = screen.getByRole('button', { name: /▾/ });
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should show all locale options in the menu', () => {
      render(<LocaleSwitcher />);

      fireEvent.click(screen.getByRole('button', { name: /▾/ }));

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(
        screen.getByRole('option', { name: 'locale.en' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'locale.fr' }),
      ).toBeInTheDocument();
    });

    it('should mark the active locale as selected', () => {
      render(<LocaleSwitcher />);

      fireEvent.click(screen.getByRole('button', { name: /▾/ }));

      expect(screen.getByRole('option', { name: 'locale.en' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('option', { name: 'locale.fr' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('should switch locale and close menu when an option is clicked', () => {
      const changeLocale = vi.fn();
      useAppStore.setState({ locale: 'en', changeLocale });

      render(<LocaleSwitcher />);

      fireEvent.click(screen.getByRole('button', { name: /▾/ }));
      fireEvent.click(screen.getByRole('option', { name: 'locale.fr' }));

      expect(changeLanguageMock).toHaveBeenCalledWith('fr');
      expect(changeLocale).toHaveBeenCalledWith('fr');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should close the menu on outside click', () => {
      render(<LocaleSwitcher />);

      fireEvent.click(screen.getByRole('button', { name: /▾/ }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should not close the menu on inside click', () => {
      render(<LocaleSwitcher />);

      const trigger = screen.getByRole('button', { name: /▾/ });
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      fireEvent.mouseDown(listbox);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('inline variant', () => {
    it('should render all locale buttons without a dropdown', () => {
      render(<LocaleSwitcher variant="inline" />);

      expect(
        screen.getByRole('button', { name: 'locale.en' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'locale.fr' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should mark the active locale button', () => {
      render(<LocaleSwitcher variant="inline" />);

      expect(screen.getByRole('button', { name: 'locale.en' })).toHaveClass(
        'active',
      );
      expect(screen.getByRole('button', { name: 'locale.fr' })).not.toHaveClass(
        'active',
      );
    });

    it('should switch locale when a button is clicked', () => {
      const changeLocale = vi.fn();
      useAppStore.setState({ locale: 'en', changeLocale });

      render(<LocaleSwitcher variant="inline" />);

      fireEvent.click(screen.getByRole('button', { name: 'locale.fr' }));

      expect(changeLanguageMock).toHaveBeenCalledWith('fr');
      expect(changeLocale).toHaveBeenCalledWith('fr');
    });
  });
});
