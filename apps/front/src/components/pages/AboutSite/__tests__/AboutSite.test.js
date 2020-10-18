/**
 * About Site Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { AboutSite } from '../AboutSite.js';
import { Header } from '../../../organisms/Header/Header';


describe('About Site', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should AboutSite render without crash', () => {
    const wrapper = shallow(<AboutSite />);

    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find(Header)).toHaveLength(1);
    expect(wrapper.find('.category')).toHaveLength(3);
  });
});
