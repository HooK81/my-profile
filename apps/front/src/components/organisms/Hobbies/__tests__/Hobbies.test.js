/**
 * Hobbies Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Hobbies } from '../Hobbies.js';
import { Hobby } from '../../../molecules/Hobby/Hobby.js';

describe('Hobbies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Hobbies render without crash', () => {
    const hobbies = [{title: "test", icon: "icon", image: "image"}, {title: "test", icon: "icon", image: "image"}];
    const wrapper = shallow(<Hobbies hobbies={hobbies} />);

    expect(wrapper.find('#hobbies')).toHaveLength(1);
    expect(wrapper.find(Hobby)).toHaveLength(2);
  });
});
