import { render, screen } from '@testing-library/react';

import Logo from './Logo';

describe('Logo', () => {
  it('should render the initials of a full name', () => {
    render(<Logo name="Julien Crochet" />);

    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  it('should render a single initial for a single word name', () => {
    render(<Logo name="Test" />);

    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
