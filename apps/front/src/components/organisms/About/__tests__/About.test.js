/**
 * About Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux'
import { mount } from 'enzyme';
import { About } from '../About.js';
import { ProfilePicture } from '../../../atoms/ProfilePicture/ProfilePicture';
import { ProtectedText } from 'react-protected-text';

// Mock Store
const mockStore = configureMockStore();
const store = mockStore({
  app: { locale: 'en' }
});

describe('About', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should About render without adress and without phone', () => {
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
    const wrapper = mount(<Provider store={store}><About profileMain={profile} /></Provider>);
    expect(wrapper.find('section#about')).toHaveLength(1);
    expect(wrapper.find(ProfilePicture)).toHaveLength(1);
    expect(wrapper.find(ProfilePicture).prop('url')).toMatch('/foo');
    expect(wrapper.find(ProtectedText)).toHaveLength(2);
  });

  it('Should About render with adress', () => {
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
    const wrapper = mount(<Provider store={store}><About profileMain={profile} /></Provider>);
    expect(wrapper.find(ProtectedText)).toHaveLength(4);
  });

  it('Should About render with phone', () => {
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
    const wrapper = mount(<Provider store={store}><About profileMain={profile} /></Provider>);
    expect(wrapper.find(ProtectedText)).toHaveLength(3);
  });
});
