/**
 * Bars Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Bars } from '../Bars.js';

describe('Bars', () => {
  it('Should Bars render 2 items without crash', () => {
    const items = [{ name: 'foo', level: '50%' },{ name: 'bar', level: '25%' }];
    const wrapper = shallow(<Bars items={items} />);

    expect(wrapper.find('.bars > ul > li')).toHaveLength(2);
    expect(wrapper.find('.bars > ul > li').at(0).find('span.bar-expand')).toHaveLength(1);
    expect(wrapper.find('.bars > ul > li').at(0).find('em').text()).toBe('foo');
    expect(wrapper.find('.bars > ul > li').at(0).find('span').prop('style')).toHaveProperty('width', '50%');
    expect(wrapper.find('.bars > ul > li').at(1).find('em').text()).toBe('bar');
    expect(wrapper.find('.bars > ul > li').at(1).find('span').prop('style')).toHaveProperty('width', '25%');
  });
});
