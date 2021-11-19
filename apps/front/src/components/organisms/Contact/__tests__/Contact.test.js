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

  it('Should Contact render without crash', () => {
    const { container } = render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    expect(screen.getAllByTitle('contact')).toHaveLength(1);
    expect(screen.getAllByRole('form', { name: 'contact-form' })).toHaveLength(
      1,
    );
    expect(container.querySelectorAll('.protected-text')).toHaveLength(2);
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

    const { container } = render(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(container.querySelectorAll('.protected-text')).toHaveLength(5);
  });

  it('Should Contact render with phone', () => {
    const profile = {
      ...profileMain,
      phone: '0000',
    };
    const { container } = render(
      <Provider store={store}>
        <Contact profileMain={profile} />
      </Provider>,
    );
    expect(container.querySelectorAll('.protected-text')).toHaveLength(3);
  });
});
