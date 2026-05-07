import { render } from '@testing-library/react';

import Icon from './Icon';

describe('Icon', () => {
  it('should render an svg for a Lucide icon name', () => {
    const { container } = render(<Icon name="LuCode" />);

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should render an svg for a Font Awesome icon name', () => {
    const { container } = render(<Icon name="FaLinkedin" />);

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should forward the className to the svg', () => {
    const { container } = render(<Icon name="LuCode" className="custom" />);

    expect(container.querySelector('svg')).toHaveClass('custom');
  });
});
