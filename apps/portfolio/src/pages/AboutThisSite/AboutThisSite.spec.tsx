import { cleanup, render, screen } from '@testing-library/react';

vi.mock('react-i18next');

import AboutThisSite from './AboutThisSite';

afterEach(() => cleanup());

describe('AboutThisSite', () => {
  it('should render a main landmark', () => {
    render(<AboutThisSite />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render the about-this-site section', () => {
    render(<AboutThisSite />);

    expect(document.getElementById('about-this-site')).toBeInTheDocument();
  });

  it('should render the section title', () => {
    render(<AboutThisSite />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'aboutThisSite.title' }),
    ).toBeInTheDocument();
  });

  it('should render the intro paragraph', () => {
    render(<AboutThisSite />);

    expect(screen.getByText('aboutThisSite.intro')).toBeInTheDocument();
  });

  it('should render all three stack row headings', () => {
    render(<AboutThisSite />);

    const h3s = screen.getAllByRole('heading', { level: 3 });
    const names = h3s.map((h) => h.textContent);

    expect(names).toStrictEqual([
      'aboutThisSite.frontend.title',
      'aboutThisSite.backend.title',
      'aboutThisSite.infrastructure.title',
    ]);
  });
});
