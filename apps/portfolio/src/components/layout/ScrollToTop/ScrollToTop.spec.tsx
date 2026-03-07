import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ScrollToTop from './ScrollToTop';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ScrollToTop', () => {
  it('should render nothing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should scroll to top on navigation without hash', () => {
    const scrollToMock = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={['/about']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('should scroll to element when hash matches an existing element', () => {
    const el = document.createElement('div');
    el.id = 'contact';
    document.body.appendChild(el);

    const scrollIntoViewMock = vi.fn();
    el.scrollIntoView = scrollIntoViewMock;

    render(
      <MemoryRouter initialEntries={['/#contact']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(el);
  });

  it('should fall back to scrollTo top when hash element does not exist', () => {
    const scrollToMock = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={['/#nonexistent']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });
});
