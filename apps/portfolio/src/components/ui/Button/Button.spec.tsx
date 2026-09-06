import { fireEvent, render, screen } from '@testing-library/react';

import Button from './Button';

describe('Button', () => {
  describe('as button', () => {
    it('should render a button element when no href is given', () => {
      render(<Button variant="secondary">Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' }),
      ).toBeInTheDocument();
    });

    it('should apply secondary variant CSS variables', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--btn-bg': 'var(--surface)',
        '--btn-border': 'var(--border)',
        '--btn-text': 'var(--text)',
        '--btn-hover-bg': 'var(--surface-strong)',
        '--btn-hover-text': 'var(--primary)',
      });
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });

    it('should apply primary variant CSS variables', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--btn-bg':
          'linear-gradient(135deg, var(--primary), var(--primary-soft))',
        '--btn-border': 'transparent',
        '--btn-text': 'var(--on-primary)',
        '--btn-hover-bg':
          'linear-gradient(135deg, var(--primary), var(--primary-soft))',
        '--btn-hover-text': 'var(--on-primary)',
      });
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('should apply custom colors when provided', () => {
      const customColors = {
        bg: '#000',
        border: '#111',
        text: '#222',
        hoverBg: '#333',
        hoverText: '#444',
      };
      render(
        <Button variant="secondary" colors={customColors}>
          Custom
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--btn-bg': '#000',
        '--btn-border': '#111',
        '--btn-text': '#222',
        '--btn-hover-bg': '#333',
        '--btn-hover-text': '#444',
      });
    });

    it('should append custom className', () => {
      render(
        <Button variant="secondary" className="custom">
          Styled
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'custom');
    });

    it('should pass through native button attributes', () => {
      render(
        <Button variant="secondary" disabled>
          Disabled
        </Button>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show a spinner, stay enabled and swallow clicks while loading', () => {
      const onClick = vi.fn();
      render(
        <Button variant="primary" isLoading onClick={onClick}>
          Send
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Send' });

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).not.toBeDisabled();
      expect(button.querySelector('svg')).not.toBeNull();

      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not render the spinner and forward clicks when not loading', () => {
      const onClick = vi.fn();
      render(
        <Button variant="primary" onClick={onClick}>
          Send
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Send' });

      expect(button).not.toHaveAttribute('aria-busy');
      expect(button.querySelector('svg')).toBeNull();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render children', () => {
      render(
        <Button variant="secondary">
          <span>Icon</span> Text
        </Button>,
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Icon Text');
    });
  });

  describe('as link', () => {
    it('should render an anchor element when href is provided', () => {
      render(
        <Button variant="secondary" href="https://example.com">
          Link
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should block navigation while a link button is loading', () => {
      render(
        <Button variant="secondary" href="https://example.com" isLoading>
          Link
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Link' });

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(event);

      expect(link).toHaveAttribute('aria-busy', 'true');
      expect(event.defaultPrevented).toBe(true);
    });

    it('should pass through native anchor attributes', () => {
      render(
        <Button
          variant="primary"
          href="https://example.com"
          target="_blank"
          rel="noopener"
        >
          External
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });
  });
});
