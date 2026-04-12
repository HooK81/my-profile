import { render, screen } from '@testing-library/react';

vi.mock('../../hooks/useScrollSpy');

vi.mock('../../components/sections/Hero/Hero', () => ({
  default: () => <div data-testid="hero" />,
}));

vi.mock('../../components/sections/About/About', () => ({
  default: () => <div data-testid="about" />,
}));

vi.mock('../../components/sections/Resume/Resume', () => ({
  default: () => <div data-testid="resume" />,
}));

vi.mock('../../components/sections/Techs/Techs', () => ({
  default: () => <div data-testid="techs" />,
}));

vi.mock('../../components/sections/Hobbies/Hobbies', () => ({
  default: () => <div data-testid="hobbies" />,
}));

vi.mock('../../components/sections/Contact/Contact', () => ({
  default: () => <div data-testid="contact" />,
}));

import { useScrollSpy } from '../../hooks/useScrollSpy';
import Home from './Home';

describe('Home', () => {
  it('should render all sections', () => {
    render(<Home />);

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('resume')).toBeInTheDocument();
    expect(screen.getByTestId('techs')).toBeInTheDocument();
    expect(screen.getByTestId('hobbies')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });

  it('should render sections in correct order', () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll('[data-testid]');
    const order = [...sections].map((el) => el.getAttribute('data-testid'));

    expect(order).toStrictEqual([
      'hero',
      'about',
      'resume',
      'techs',
      'hobbies',
      'contact',
    ]);
  });

  it('should activate scroll spy', () => {
    render(<Home />);

    expect(useScrollSpy).toHaveBeenCalled();
  });
});
