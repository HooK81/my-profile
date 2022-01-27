/**
 * Hobby Test Suites
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Hobby } from '../Hobby.js';

describe('Hobby', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should overlay appears correctly', async () => {
    render(<Hobby title="title" icon="icon" image="gaming.png" />);

    fireEvent.mouseEnter(screen.queryByAltText('title')); // Hover image
    await screen.findByText('title'); // Wait for icon

    fireEvent.mouseLeave(screen.queryByAltText('title')); // Leave image
    await waitFor(
      () => expect(screen.queryByText('title')).not.toBeInTheDocument(), // Wait for icon disappear
    );
  });
});
