/**
 * Contact Test Suites
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Contact } from '../Contact.js';

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

  it('should Contact render without crash', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Contact render with address', () => {
    const profile = {
      ...profileMain,
      address: {
        street: '1 infinite loop',
        zip: 'CA99',
        city: 'Cupertino',
        country: 'USA',
      },
    };

    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Contact render with phone', () => {
    const profile = {
      ...profileMain,
      phone: '0000',
    };
    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
