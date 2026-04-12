import { render, screen } from '@testing-library/react';

import ScrollDown from './ScrollDown';

describe('ScrollDown', () => {
  it('should render a link pointing to the given href', () => {
    render(<ScrollDown href="#about" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#about');
  });

  it('should display the translated scroll-down label', () => {
    render(<ScrollDown href="#contact" />);

    expect(screen.getByText('scrollDown.label')).toBeInTheDocument();
  });
});
