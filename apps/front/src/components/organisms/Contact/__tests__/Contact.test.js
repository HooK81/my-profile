/**
 * Contact Test Suites
 */

import React from 'react';
import { mount } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Contact } from '../Contact.js';
import ReCAPTCHA from 'react-google-recaptcha';
import { ProtectedText } from 'react-protected-text';

const profileMain = {
  fullName: '',
  email: '',
  phone: '',
  address: {
    country: '',
    city: '',
    zip: '',
    street: '',
  },
};

// Mock API
jest.mock('../../../../api/index');

// Mock Store
const mockStore = configureMockStore();
const store = mockStore({
  app: { locale: 'en' },
});

describe('Contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Contact render without crash', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    expect(wrapper.find('section#contact')).toHaveLength(1);
    expect(wrapper.find(ReCAPTCHA)).toHaveLength(1);
    expect(wrapper.find('.btn-submit').prop('disabled')).toBe(true);
    expect(wrapper.find(ProtectedText)).toHaveLength(2);
  });

  it('Should Contact render with address', () => {
    const profile = {
      ...profileMain,
      address: {
        street: '1 infinite loop',
        zip: 'CA99',
        city: 'Cupertino',
        country: 'USA',
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(wrapper.find(ProtectedText)).toHaveLength(5);
  });

  it('Should Contact render with phone', () => {
    const profile = {
      ...profileMain,
      phone: '0000',
    }
    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(wrapper.find(ProtectedText)).toHaveLength(3);
  });
});
