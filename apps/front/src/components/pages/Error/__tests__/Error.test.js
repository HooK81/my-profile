/**
 * Error Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Error } from '../Error.js';
import { Header } from '../../../organisms/Header/Header';


describe('Error', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Error 404 render without crash', () => {
    const wrapper = shallow(<Error type="404" />);

    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find(Header)).toHaveLength(1);
    expect(wrapper.find('.message').text()).toMatch('404');
  });

  it('Should Error 500 render without crash', () => {
    const wrapper = shallow(<Error type="500" message="foo bar"/>);
    expect(wrapper.find('section')).toHaveLength(1);
    expect(wrapper.find(Header)).toHaveLength(1);
    expect(wrapper.find('.message').text()).toMatch('500');
    expect(wrapper.find('.message').text()).toMatch('foo bar');
  });
});
