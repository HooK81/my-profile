/**
 * About Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { About } from '../About.js';
import { ProfilePicture } from '../../../atoms/ProfilePicture/ProfilePicture';
import { ProtectedText } from '../../../atoms/ProtectedText/ProtectedText';

describe('About', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should About render without crash without adress and without phone', () => {
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
    };
    const wrapper = mount(<About profileMain={profile} />);
    expect(wrapper.find('section#about')).toHaveLength(1);
    expect(wrapper.find(ProfilePicture)).toHaveLength(1);
    expect(wrapper.find(ProfilePicture).prop('url')).toMatch('/foo');
    expect(wrapper.find(ProtectedText)).toHaveLength(1);
  });

  it('Should About render without crash with adress', () => {
    const profile = {
      name: '',
      fullName: '',
      image: 'foo',
      address: {
        street: '1 infinite loop',
        zip: 'CA99',
        city: 'Cupertino',
        country: 'USA',
      },
      phone: '',
    };
    const wrapper = mount(<About profileMain={profile} />);
    expect(wrapper.find(ProtectedText)).toHaveLength(3);
  });

  it('Should About render without crash with phone', () => {
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
      phone: '000000000',
    };
    const wrapper = mount(<About profileMain={profile} />);
    expect(wrapper.find(ProtectedText)).toHaveLength(2);
  });
});
