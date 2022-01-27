/**
 * Footer Test Suites
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('should Footer render without crash', () => {
    const { asFragment } = render(
      <Footer profileMain={{ networks: [], fullName: 'John DOE' }} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Footer render without crash when props missing', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
