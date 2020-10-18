/**
 * Hobby Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Hobby } from '../Hobby.js';

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
};

describe('Hobby', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should overlay appears correctly', () => {
    const wrapper = mount(<Hobby title="title" icon="icon" image="gaming.png" />);
    waitForComponentToPaint(wrapper);

    const item = wrapper.find('.item-wrap');
    expect(item).toHaveLength(1);
    expect(wrapper.find('.overlay')).toHaveLength(1);
    expect(wrapper.find('.overlay.hover')).toHaveLength(0);
    act(() => {
      item.simulate('mouseenter');
    });
    wrapper.update();
    expect(wrapper.find('.overlay.hover')).toHaveLength(1);
    act(() => {
      item.simulate('mouseleave');
    });
    wrapper.update();
    expect(wrapper.find('.overlay.hover')).toHaveLength(0);
  });
});
