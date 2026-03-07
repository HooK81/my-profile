import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../Navbar/Navbar', () => ({
  default: () => <nav data-testid="navbar" />,
}));

vi.mock('../Footer/Footer', () => ({
  default: () => <footer data-testid="footer" />,
}));

import Layout from './Layout';

describe('Layout', () => {
  it('should render the navbar', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('should render the footer', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render the outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<main>page content</main>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('page content')).toBeInTheDocument();
  });
});
