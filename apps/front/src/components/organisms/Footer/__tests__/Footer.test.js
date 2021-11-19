/**
 * Footer Test Suites
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {

  it('Should Footer render without crash', () => {
    render(<Footer profileMain={{networks: [], fullName: 'John DOE'}} />);
    expect(screen.getAllByRole('contentinfo', {name: "footer"})).toHaveLength(1);
    expect(screen.getAllByRole('list', {name: "copyright"})).toHaveLength(1);
    expect(screen.getAllByRole('list', {name: "social-links"})).toHaveLength(1);
    expect(screen.getAllByTitle('recaptcha-branding')).toHaveLength(1);
  });

  it('Should Footer render without crash when props missing', () => {
    render(<Footer />);

    expect(screen.getAllByRole('contentinfo', {name: "footer"})).toHaveLength(1);
    expect(screen.queryAllByRole('list', {name: "social-links"})).toHaveLength(0);
  });
});
