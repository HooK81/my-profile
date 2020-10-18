/**
 * About Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { About } from '../About.js';
import { ProfilePicture } from '../../../atoms/ProfilePicture/ProfilePicture';

describe('About', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should About render without crash', () => {
    const profile = {
      name: '',
      fullName: '',
      image: 'foo',
      address: {
        street: '',
        zip: '',
        city: '',
        country: '',
      },
      phone: '',
    }
    const wrapper = mount(<About profileMain={profile} />);
    expect(wrapper.find('section#about')).toHaveLength(1);
    expect(wrapper.find(ProfilePicture)).toHaveLength(1);
    expect(wrapper.find(ProfilePicture).prop('url')).toMatch('/foo');
  });
});
