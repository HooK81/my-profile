import { cleanup, render, screen } from '@testing-library/react';

import Section from './Section';

afterEach(() => cleanup());

describe('Section', () => {
  it('should render with the given id', () => {
    render(
      <Section id="test-section" variant="primary">
        content
      </Section>,
    );

    expect(document.getElementById('test-section')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Section id="s" variant="primary">
        child content
      </Section>,
    );

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('should render the title when provided', () => {
    render(
      <Section id="s" variant="primary" title="My Title">
        content
      </Section>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'My Title' }),
    ).toBeInTheDocument();
  });

  it('should render the decorative index next to the title', () => {
    render(
      <Section id="s" variant="primary" title="My Title" index="01">
        content
      </Section>,
    );

    const index = screen.getByText('01');
    expect(index).toHaveAttribute('aria-hidden', 'true');
    expect(index.parentElement).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'My Title' }),
    );
  });

  it('should not render the index when title is omitted', () => {
    render(
      <Section id="s" variant="primary" index="01">
        content
      </Section>,
    );

    expect(screen.queryByText('01')).toBeNull();
  });

  it('should render the description below the title', () => {
    render(
      <Section
        id="s"
        variant="primary"
        title="My Title"
        description="Some description"
      >
        content
      </Section>,
    );

    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('should not render a heading when title is omitted', () => {
    render(
      <Section id="s" variant="primary">
        content
      </Section>,
    );

    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('should apply primary variant class when specified', () => {
    const { container } = render(
      <Section id="s" variant="primary">
        content
      </Section>,
    );

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
