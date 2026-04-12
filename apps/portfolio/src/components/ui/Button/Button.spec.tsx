import { render, screen } from '@testing-library/react';

import Button from './Button';

describe('Button', () => {
  describe('as button', () => {
    it('should render a button element by default', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' }),
      ).toBeInTheDocument();
    });

    it('should apply outlined variant CSS variables by default', () => {
      render(<Button>Outlined</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--btn-bg': 'transparent',
        '--btn-border': 'var(--color-teal)',
        '--btn-text': 'var(--color-teal)',
        '--btn-hover-bg': 'var(--color-teal)',
        '--btn-hover-text': 'var(--color-darkest)',
      });
    });

    it('should apply filled variant CSS variables', () => {
      render(<Button variant="filled">Filled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        '--btn-bg': 'var(--color-teal)',
        '--btn-border': 'var(--color-teal)',
        '--btn-text': 'var(--color-darkest)',
        '--btn-hover-bg': 'var(--color-light)',
        '--btn-hover-text': 'var(--color-darkest)',
      });
    });

    it('should apply custom colors when provided', () => {
      const customColors = {
        bg: '#000',
        border: '#111',
        text: '#222',
        hoverBg: '#333',
        hoverText: '#444',
      };
      render(<Button colors={customColors}>Custom</Button>);
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
      render(<Button className="custom">Styled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'custom');
    });

    it('should pass through native button attributes', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render children', () => {
      render(
        <Button>
          <span>Icon</span> Text
        </Button>,
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Icon Text');
    });
  });

  describe('as link', () => {
    it('should render an anchor element when href is provided', () => {
      render(<Button href="https://example.com">Link</Button>);
      const link = screen.getByRole('link', { name: 'Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should pass through native anchor attributes', () => {
      render(
        <Button href="https://example.com" target="_blank" rel="noopener">
          External
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });
  });
});
