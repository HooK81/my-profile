import { cleanup, fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next');

import AppError from './AppError';

afterEach(() => cleanup());

describe('AppError', () => {
  it('should render the error message as an alert', () => {
    render(<AppError onRetry={vi.fn()} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'error.title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('error.tryAgainLater')).toBeInTheDocument();
  });

  it('should call onRetry when the retry button is clicked', () => {
    const onRetry = vi.fn();

    render(<AppError onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'error.retry' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
