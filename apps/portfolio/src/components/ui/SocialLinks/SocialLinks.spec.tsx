import { render, screen } from '@testing-library/react';
import type { Network } from 'my-profile-shared';

import SocialLinks from './SocialLinks';

const networks: Network[] = [
  { name: 'GitHub', url: 'https://github.com/johndoe', icon: 'FaGithub' },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/johndoe',
    icon: 'FaLinkedin',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/johndoe',
    icon: 'FaXTwitter',
  },
];

describe('SocialLinks', () => {
  it('should render a link for each network', () => {
    render(<SocialLinks networks={networks} size="md" />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    for (const network of networks) {
      const link = screen.getByTitle(network.name).closest('a');
      expect(link).toHaveAttribute('href', network.url);
    }
  });

  it('should open links in a new tab with secure rel attribute', () => {
    render(<SocialLinks networks={networks} size="md" />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('should render an svg icon for each network', () => {
    render(<SocialLinks networks={networks} size="md" />);

    for (const network of networks) {
      const link = screen.getByTitle(network.name);
      expect(link.querySelector('svg')).not.toBeNull();
    }
  });

  it('should apply the md size class', () => {
    render(<SocialLinks networks={networks} size="md" />);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('md');
  });

  it('should apply the specified size class', () => {
    render(<SocialLinks networks={networks} size="lg" />);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('lg');
  });

  it('should render an empty list when no networks are provided', () => {
    render(<SocialLinks networks={[]} size="md" />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
