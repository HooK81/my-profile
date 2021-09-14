/**
 * SocialLinks Test Suites
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { SocialLinks } from '../SocialLinks.js';

describe('SocialLinks', () => {
  it('Should NavSocialLinks render 1 item without crash', () => {
    const networks = [{ name: 'name', url: 'url', icon: 'icon' }];
    const wrapper = shallow(<SocialLinks networks={networks} />);
    expect(wrapper.find('li > a > i.icon')).toHaveLength(1);
  });

  it('Should NavSocialLinks render 2 item without crash', () => {
    const networks = [{ name: 'name', url: 'url', icon: 'icon' },{ name: 'name2', url: 'url2', icon: 'icon2' }];
    const wrapper = shallow(<SocialLinks networks={networks} />);
    expect(wrapper.find('li > a > i')).toHaveLength(2);
    expect(wrapper.find('li > a > i.icon2')).toHaveLength(1);
  });

  it('Should NavSocialLinks render no item without crash', () => {
    const wrapper = shallow(<SocialLinks networks={[]}/>);
    expect(wrapper.find('li > a > i')).toHaveLength(0);
  });
});
