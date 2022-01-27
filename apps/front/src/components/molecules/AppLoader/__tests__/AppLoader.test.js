/**
 * AppLoader Test Suites
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AppLoader } from '../AppLoader.js';

describe('AppLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML = '<div id="site-loader">loading</div>';
  });

  it('should AppLoader be visible during loading', async () => {
    const { asFragment } = render(<AppLoader isLoaded={false} />);
    expect(asFragment()).toMatchSnapshot();
    await waitFor(() =>
      expect(screen.queryByText('loading')).toBeInTheDocument(),
    );
  });

  it('should AppLoader disappear when loaded', async () => {
    render(<AppLoader isLoaded={true} />);
    await waitFor(
      () => expect(screen.queryByText('loading')).not.toBeInTheDocument(),
      { timeout: 1200 },
    );
  });

  it('should AppLoader do nothing when loading div is missing', async () => {
    document.body.innerHTML = '<div id="other">not-loader</div>';

    render(<AppLoader isLoaded={true} />);
    await new Promise((done) =>
      setTimeout(() => {
        expect(screen.queryByText('not-loader')).toBeInTheDocument();
        done();
      }, 600),
    );
  });
});
