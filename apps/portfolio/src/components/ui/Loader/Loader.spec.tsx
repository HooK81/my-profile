import { render } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Loader from './Loader';

describe('Loader', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the overlay when not loaded', () => {
    const { container } = render(<Loader isLoaded={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('removes the overlay after 500ms when isLoaded=true', () => {
    const { container, rerender } = render(<Loader isLoaded={false} />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Loader isLoaded={true} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.firstChild).toBeNull();
  });
});
