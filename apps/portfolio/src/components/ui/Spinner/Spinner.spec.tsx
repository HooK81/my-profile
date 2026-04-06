import { render } from '@testing-library/react';

import Spinner from './Spinner';

describe('Spinner', () => {
  it('should render the spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
