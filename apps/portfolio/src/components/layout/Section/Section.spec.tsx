import { cleanup, render, screen } from '@testing-library/react';

import Section from './Section';

afterEach(() => cleanup());

describe('Section', () => {
  it('should render with the given id', () => {
    render(<Section id="test-section">content</Section>);

    expect(document.getElementById('test-section')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(<Section id="s">child content</Section>);

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('should render the title when provided', () => {
    render(
      <Section id="s" title="My Title">
        content
      </Section>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'My Title' }),
    ).toBeInTheDocument();
  });

  it('should not render a heading when title is omitted', () => {
    render(<Section id="s">content</Section>);

    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('should use primary variant by default', () => {
    const { container } = render(<Section id="s">content</Section>);

    expect(container.firstChild).toHaveClass('primary');
  });

  it('should apply secondary variant class when specified', () => {
    const { container } = render(
      <Section id="s" variant="secondary">
        content
      </Section>,
    );

    expect(container.firstChild).toHaveClass('secondary');
    expect(container.firstChild).not.toHaveClass('primary');
  });
});
