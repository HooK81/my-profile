/**
 * SocialLinks Test Suites
 */
import React from 'react';
import { render } from '@testing-library/react';
import { SocialLinks } from '../SocialLinks.js';

describe('SocialLinks', () => {
  it('should NavSocialLinks render 1 item without crash', () => {
    const networks = [{ name: 'name', url: 'url', icon: 'icon' }];
    const { asFragment } = render(<SocialLinks networks={networks} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should NavSocialLinks render 2 item without crash', () => {
    const networks = [
      { name: 'name', url: 'url', icon: 'icon' },
      { name: 'name2', url: 'url2', icon: 'icon2' },
    ];
    const { asFragment } = render(<SocialLinks networks={networks} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should NavSocialLinks render no item without crash', () => {
    const { asFragment } = render(<SocialLinks networks={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
