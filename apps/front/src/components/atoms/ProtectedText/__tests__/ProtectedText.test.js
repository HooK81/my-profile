/**
 * ProtectedText Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { ProtectedText } from '../ProtectedText.js';

describe('ProtectedText', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should ProtectedText works without text', () => {
    const wrapper = mount(<ProtectedText />);
    expect(wrapper.find('.protected-text span')).toHaveLength(0);
  });

  it('Should ProtectedText works with empty text', () => {
    const wrapper = mount(<ProtectedText text="" />);
    expect(wrapper.find('.protected-text span')).toHaveLength(0);
  });

  it('Should ProtectedText works with a text', () => {
    const wrapper = mount(<ProtectedText text="foobar" />);
    expect(wrapper.find('.protected-text span').text()).toBe('bo'); //ra[bo]of
  });

  it('Should ProtectedText handle strSplitIn3 with size of 0', () => {
    Math.max = jest.fn();
    Math.max.mockReturnValue(0);
    const wrapper = mount(<ProtectedText text="foobar" />);
    expect(wrapper.find('.protected-text span').text()).toBe('');
  });

  it('Should ProtectedText render protectedClassName', () => {
    const wrapper = mount(<ProtectedText text="foobar" protectedClassName="baz" />);
    expect(wrapper.find('.protected-text.baz')).toHaveLength(1);
  });
});
