import { render } from '@testing-library/react';
import { act } from 'react';

import AppLoader from './AppLoader';

describe('AppLoader', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should render the overlay when not loaded', () => {
    const { container } = render(<AppLoader isLoaded={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should remove the overlay after 500ms when isLoaded=true', () => {
    const { container, rerender } = render(<AppLoader isLoaded={false} />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<AppLoader isLoaded={true} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.firstChild).toBeNull();
  });
});
