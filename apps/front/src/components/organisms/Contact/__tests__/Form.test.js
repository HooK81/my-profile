/**
 * Contact Form Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ReCAPTCHA, { mockReset } from 'react-google-recaptcha'; // Mocked in __mocks__
import { Contact } from '../Contact.js';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash/fp';
import { api } from '../../../../api/index';
import { ApiError } from '../../../../api/Api';

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
jest.mock('react-toastify');

describe('Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should form display required error when value are invalid', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    await act(async () => {
      captcha.simulate('change');
      form.simulate('submit');
    });
    wrapper.update();
    expect(wrapper.find('span.error')).toHaveLength(2);
  });

  it('should send an email when form is valid', async () => {
    api.post.mockResolvedValue({});

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    //wrapper.find('#contactEmail').simulate('change', { target: { value: 'fakeMail@fake.com' } }); // This doesn't work cause by react hook form
    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));
    await act(async () => {
      captcha.simulate('change');
      form.simulate('submit');
    });
    wrapper.update();
    expect(wrapper.find('.fa-spinner')).toHaveLength(0);
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should handle basic error when sending email', async () => {
    api.post.mockRejectedValue(new Error('the error'));

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      captcha.simulate('change');
      form.simulate('submit');
    });

    expect(wrapper.find('.fa-spinner')).toHaveLength(0);
    expect(wrapper.find('button.btn-submit').prop('disabled')).toBeTruthy();
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should handle backend error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('the error', 500));

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      captcha.simulate('change');
      form.simulate('submit');
    });
    wrapper.update();

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(wrapper.find('span.error')).toHaveLength(0);
  });

  it('should handle form validation error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('form error', 400, {errors: [{email: ['the error']}]}));
    api.buildFormErrors.mockReturnValue({email: {message: 'the error', type: 'pattern'}});

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      captcha.simulate('change');
      form.simulate('submit');
    });
    wrapper.update();

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(0);
    expect(toast.error).toHaveBeenCalledTimes(0);
    expect(wrapper.find('span.error')).toHaveLength(1);
  });

  it('should form display spinner when sending an email', async () => {
    api.post.mockResolvedValue(
      new Promise((done) =>
        setTimeout(() => {
          done();
        }, 1000),
      ),
    );

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    act(() => {
      captcha.simulate('change');
      form.simulate('submit');

      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('.fa-spinner')).toHaveLength(1);
      });
    });

    await act(async () => {
      await new Promise((done) =>
        setTimeout(() => {
          wrapper.update();
          expect(wrapper.find('button.btn-submit').prop('disabled')).toBe(true);
          done();
        }, 1000),
      );
    });
  });

  it('should captcha invalidate after timeout', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const captcha = wrapper.find('.submit input[type="checkbox"]');
    expect(wrapper.find('button.btn-submit').prop('disabled')).toBeTruthy(); // Button is disabled
    await act(async () => {
      captcha.simulate('change');
    });
    wrapper.update();
    expect(wrapper.find('button.btn-submit').prop('disabled')).toBeFalsy(); // Button is enabled

    await act(async () => {
      await new Promise((done) =>
        setTimeout(() => {
          done();
        }, 4900),
      );
    });
    wrapper.update();
    expect(wrapper.find('button.btn-submit').prop('disabled')).toBeTruthy(); // Button is disabled after expiracy delay
  });
});
