/**
 * ProtectedText Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { ProtectedText } from '../ProtectedText.js';

delete window.location;
delete window.open;
window.location = { assign: jest.fn() };
window.open = jest.fn();

describe('ProtectedText for Text', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should ProtectedText render without text', () => {
    const wrapper = mount(<ProtectedText />);
    expect(wrapper.find('.protected-text span')).toHaveLength(0);
  });

  it('Should ProtectedText render with empty text', () => {
    const wrapper = mount(<ProtectedText text="" />);
    expect(wrapper.find('.protected-text span')).toHaveLength(0);
  });

  it('Should ProtectedText render with a text', () => {
    const wrapper = mount(<ProtectedText text="foobar" />);
    expect(wrapper.find('.protected-text span')).toHaveLength(1);
    expect(wrapper.find('style').text().replace(/\s/g, '')).toMatch(':before{content:"ra"'); //[ra]boof
    expect(wrapper.find('.protected-text span').text()).toBe('bo'); //ra[bo]of
    expect(wrapper.find('style').text().replace(/\s/g, '')).toMatch(':after{content:"of"'); //rabo[of]
  });

  it('Should ProtectedText render a text with custom ClassName', () => {
    const wrapper = mount(<ProtectedText text="foobar" className="baz" />);
    expect(wrapper.find('span.protected-text.baz')).toHaveLength(1);
  });

  it('Should ProtectedText render a text with other props', () => {
    const wrapper = mount(<ProtectedText text="foobar" other="baz" />);
    expect(wrapper.find('.protected-text span').prop('other')).toBe('baz');
  });
});

describe('ProtectedText for Link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should ProtectedText render a basic link', () => {
    const wrapper = mount(<ProtectedText text="foobar" href="https://foobar.com" />);
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    expect(wrapper.find('style').text().replace(/\s/g, '')).toMatch(':before{content:"ra"'); //[ra]boof
    expect(wrapper.find('.protected-text a').text()).toBe('bo'); //ra[bo]of
    expect(wrapper.find('style').text().replace(/\s/g, '')).toMatch(':after{content:"of"'); //rabo[of]
    expect(wrapper.find('.protected-text a').prop('href')).toBe('https://click');
  });

  it('Should ProtectedText with empty href render a text', () => {
    const wrapper = mount(<ProtectedText text="foobar" href="" />);
    expect(wrapper.find('.protected-text span')).toHaveLength(1);
    expect(wrapper.find('.protected-text span').text()).toBe('bo');
  });

  it('Should ProtectedText render a link with custom ClassName', () => {
    const wrapper = mount(<ProtectedText text="foobar" className="baz" href="https://foobar.com" />);
    expect(wrapper.find('span.protected-text.baz')).toHaveLength(1);
  });

  it('Should ProtectedText render a text with other props', () => {
    const wrapper = mount(<ProtectedText text="foobar" href="https://foobar.com" other="baz" />);
    expect(wrapper.find('.protected-text a').prop('other')).toBe('baz');
  });

  it('Should ProtectedText render a link with specific protectedHref', () => {
    const wrapper = mount(
      <ProtectedText text="foobar" href="https://foobar.com" protectedHref="https://do-not-click" />,
    );
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    expect(wrapper.find('.protected-text a').prop('href')).toBe('https://do-not-click');
  });

  it('Should ProtectedText can open Link', () => {
    const wrapper = mount(<ProtectedText text="foobar" href="https://foobar.com" />);
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    wrapper.find('.protected-text a').simulate('click');
    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('https://foobar.com');
  });

  it('Should ProtectedText can open Link on other tab', () => {
    const wrapper = mount(<ProtectedText text="foobar" href="https://foobar.com" />);
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    wrapper.find('.protected-text a').simulate('click', { ctrlKey: true });
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith('https://foobar.com', '_blank');
  });

  it('Should ProtectedText can open Link with 1 header', () => {
    const wrapper = mount(
      <ProtectedText text="foobar" href="mailto:john@doe.com" hrefHeaders={{ subject: 'subject' }} />,
    );
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    wrapper.find('.protected-text a').simulate('click');
    expect(window.location.assign).toHaveBeenCalledWith('mailto:john@doe.com?subject=subject');
  });

  it('Should ProtectedText can open Link with more than 1 headers', () => {
    const wrapper = mount(
      <ProtectedText
        text="foobar"
        href="mailto:john@doe.com"
        hrefHeaders={{ subject: 'subject', cc: 'foo@bar.com' }}
      />,
    );
    expect(wrapper.find('.protected-text a')).toHaveLength(1);
    wrapper.find('.protected-text a').simulate('click');
    expect(window.location.assign).toHaveBeenCalledWith('mailto:john@doe.com?subject=subject&cc=foo%40bar.com');
  });
});
