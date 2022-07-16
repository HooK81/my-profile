/**
 * Contact Form Test Suites
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from '../Contact.js';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
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

// Mock Toastify
jest.mock('react-toastify');

describe('Form 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should form display required error when value are invalid', async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));
    await screen.findAllByRole("alert");
    expect(asFragment()).toMatchSnapshot();
    expect(api.post).toHaveBeenCalledTimes(0);
  });

  it('should send an email when form is valid', async () => {
    render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.input(screen.getByRole("textbox", { name: /message.email/i }), {
      target: {
        value: "test@mail.com"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.subject/i }), {
      target: {
        value: "subject"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.message/i }), {
      target: {
        value: "text to send"
      }
    });
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));

    await waitFor(() => expect(screen.queryAllByTitle('spinner')).toHaveLength(1));
    await waitFor(() => expect(screen.queryAllByTitle('spinner')).toHaveLength(0));
    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it('should handle basic error when sending email', async () => {
    api.post.mockRejectedValue(new Error('the error'));

    render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.input(screen.getByRole("textbox", { name: /message.email/i }), {
      target: {
        value: "test@mail.com"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.message/i }), {
      target: {
        value: "text to send"
      }
    });
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should handle backend error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('the error', 500));

    render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.input(screen.getByRole("textbox", { name: /message.email/i }), {
      target: {
        value: "test@mail.com"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.message/i }), {
      target: {
        value: "text to send"
      }
    });
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(1);
  });

  it('should handle symfony form field validation error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('form error', 400, {errors: [{email: ['the error']}]}));
    api.buildFormErrors.mockReturnValue({email: {message: 'the error', type: 'pattern'}});

    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.input(screen.getByRole("textbox", { name: /message.email/i }), {
      target: {
        value: "test@mail.com"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.message/i }), {
      target: {
        value: "text to send"
      }
    });
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));

    await screen.findAllByRole("alert");
    expect(asFragment()).toMatchSnapshot();
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(0);
  });

  it('should handle symfony form validation error when sending email', async () => {
    api.post.mockRejectedValue(new ApiError('form error', 400, {errors: [{mail: ['form error']}]}));
    api.buildFormErrors.mockReturnValue({mail: {message: 'form error', type: 'pattern'}});

    const { asFragment } = render(
      <Provider store={store}>
        <Contact profileMain={profileMain} />
      </Provider>,
    );
    fireEvent.input(screen.getByRole("textbox", { name: /message.email/i }), {
      target: {
        value: "test@mail.com"
      }
    });
    fireEvent.input(screen.getByRole("textbox", { name: /message.message/i }), {
      target: {
        value: "text to send"
      }
    });
    fireEvent.submit(screen.getByRole("button", {name: /contact.message.submit/i}));

    await screen.findAllByRole("alert");
    expect(asFragment()).toMatchSnapshot();
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledTimes(0);
  });
});
