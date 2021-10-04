/**
 * Contact Form Test Suites
 */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Contact } from '../Contact.js';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import { api } from '../../../../api/index';
import { ApiError } from '../../../../api/Api';
import { getReCaptchaToken } from '../../../../utils/reCaptcha';

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

// Mock Toastify
jest.mock('react-toastify');

// Mock reCaptcha HooK
jest.mock('../../../../utils/reCaptcha');

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
    const form = wrapper.find('#contactForm');

    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();
    expect(wrapper.find('span.error')).toHaveLength(2);
    expect(getReCaptchaToken).toHaveBeenCalledTimes(0);
    expect(api.post).toHaveBeenCalledTimes(0);
  });

  it('should send an email when form is valid', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const form = wrapper.find('#contactForm');

    //wrapper.find('#contactEmail').simulate('change', { target: { value: 'fakeMail@fake.com' } }); // This doesn't work cause by react hook form
    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));
    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();
    expect(wrapper.find('.fa-spinner')).toHaveLength(0);
    expect(getReCaptchaToken).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it('should handle basic error when sending email', async () => {
    api.post.mockRejectedValue(new Error('the error'));

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      form.simulate('submit');
    });

    expect(wrapper.find('.fa-spinner')).toHaveLength(0);
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should handle backend error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('the error', 500));

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(wrapper.find('span.error')).toHaveLength(0);
  });

  it('should handle symfony form field validation error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('form error', 400, {errors: [{email: ['the error']}]}));
    api.buildFormErrors.mockReturnValue({email: {message: 'the error', type: 'pattern'}});

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(0);
    expect(wrapper.find('span.error')).toHaveLength(1);
  });

  it('should handle symfony form validation error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('form error', 400, {errors: [{mail: ['form error']}]}));
    api.buildFormErrors.mockReturnValue({mail: {message: 'form error', type: 'pattern'}});

    const wrapper = mount(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    await act(async () => {
      form.simulate('submit');
    });
    wrapper.update();

    expect(api.post).toHaveBeenCalledTimes(1);
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
    const form = wrapper.find('#contactForm');

    wrapper.find('#contactEmail').getDOMNode().value = 'fakeMail@fake.com';
    wrapper.find('#contactEmail').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactMessage').getDOMNode().value = 'the message to send';
    wrapper.find('#contactMessage').getDOMNode().dispatchEvent(new Event('input'));
    wrapper.find('#contactSubject').getDOMNode().value = 'subject';
    wrapper.find('#contactSubject').getDOMNode().dispatchEvent(new Event('input'));

    act(() => {
      form.simulate('submit');

      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('.fa-spinner')).toHaveLength(1);
      });
    });

    await act(async () => {
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('.fa-spinner')).toHaveLength(0);
        done();
      }, 1000);
    });
  });
});
