/**
 * Hobbies Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Hobbies } from '../Hobbies.js';
import { Hobby } from '../../../molecules/Hobby/Hobby.js';
import { act } from 'react-dom/test-utils';

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    wrapper.update();
  });
};

describe('Hobbies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Hobbies render without crash', async () => {
    const hobbies = [{title: "test", icon: "icon", image: "gaming.jpg"}, {title: "test", icon: "icon", image: "gaming.jpg"}];
    const wrapper = mount(<Hobbies hobbies={hobbies} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('#hobbies')).toHaveLength(1);
    expect(wrapper.find(Hobby)).toHaveLength(2);
  });

  it('Should Hobbies handle missing asset', async () => {
    const hobbies = [{title: "test", icon: "icon", image: "whatever.jpg"}];
    const wrapper = mount(<Hobbies hobbies={hobbies} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find(Hobby)).toHaveLength(1);
    expect(wrapper.find(Hobby).at(0).props('image').image).toBe('missing.png');
  });
});
