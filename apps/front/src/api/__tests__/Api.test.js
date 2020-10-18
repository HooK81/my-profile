/**
 * API Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import axios from 'axios';
import uuidv4 from 'uuid/v4';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import Routing from '../routing/router';

jest.mock('axios');
jest.mock('uuid/v4');
jest.mock('react-toastify');
jest.mock('i18next');
Routing.setBaseUrl('');
import { Api } from '../Api';

describe('Api Get', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Get return values', async () => {
    const expected = { data: 'test' };
    axios.get.mockResolvedValue(expected);
    axios.create.mockReturnValue(axios);

    const api = new Api();
    const received = await api.get('get_user', {
      id: 'id',
    });

    expect(received).toEqual(expected);
  });

  it('Should Get throw an error without toast', async () => {
    axios.get.mockImplementation(() => {
      return Promise.reject(Error('mock'));
    });

    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(2);
    await expect(api.get('get_user', { id: 'test' }, {showError: false})).rejects.toEqual(Error('mock'));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('Should Post throw an error with toast', async () => {
    axios.get.mockImplementation(() => {
      return Promise.reject(Error('mock'));
    });

    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(2);
    await expect(api.get('get_user', { id: 'test' })).rejects.toEqual(Error('mock'));
    expect(toast.error).toHaveBeenCalled();
  });

  it('Should Get throw an invalid route error', async () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(1);
    await expect(api.get('fake')).rejects.toEqual(Error('The route "fake" does not exist.'));
  });
});

describe('Api Post', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Post return values', async () => {
    const expected = { data: 'test' };
    axios.post.mockResolvedValue(expected);
    axios.create.mockReturnValue(axios);

    const api = new Api();
    const received = await api.post('login');

    expect(received).toEqual(expected);
  });

  it('Should Post throw an error without toast', async () => {
    axios.post.mockImplementation(() => {
      return Promise.reject(Error('mock'));
    });

    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(2);
    await expect(api.post('login', null, {}, {showError: false})).rejects.toEqual(Error('mock'));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('Should Post throw an error with toast', async () => {
    axios.post.mockImplementation(() => {
      return Promise.reject(Error('mock'));
    });

    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(2);
    await expect(api.post('login')).rejects.toEqual(Error('mock'));
    expect(toast.error).toHaveBeenCalled();
  });

  it('Should Post throw an invalid route error', async () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    expect.assertions(1);
    await expect(api.post('fake')).rejects.toEqual(Error('The route "fake" does not exist.'));
  });
});

describe('Api Basics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_JWT_USER_UUID = '4eb7ab3f-9c7a-4954-9d87-b5631c755a46';
  });

  it('Should onGetToken called ', async () => {
    axios.create.mockReturnValue(axios);

    const props = { onGetToken: jest.fn() };
    const api = new Api(props);
    api.refreshToken();

    expect(props.onGetToken).toHaveBeenCalled();
  });

  it('Should onGetToken not called without props', async () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    api.refreshToken();

    expect(api.props).toBeFalsy();
  });

  it('Should setToken returns without crash ', () => {
    axios.create.mockReturnValue(axios);
    const api = new Api();

    const expected = 'bla';
    api.setToken(expected);

    expect(api.token).toBe(expected);
  });

  it('Should getCredentials returns without crash ', () => {
    axios.create.mockReturnValue(axios);
    uuidv4.mockReturnValue('7a4837a2-ab2c-57aa-a027-960eeb62d025');

    const api = new Api();
    const expected = {"key": "48632545-1cb7-5ae2-a3b1-70687e11227b", "password": "220f0069f32d7749da01387fb53b840754ecbd0e991ce93a94f0b4a2ed069723", "username": "7a4837a2-ab2c-57aa-a027-960eeb62d025"};

    expect(api.getCredentials()).toEqual(expected);
  });

  it('Should buildUrl returns with routePArameters null', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    const route = "login";
    const expected = "/auth/login";

    expect(api.buildUrl(route, null)).toEqual(expected);
  });

  it('Should buildUrl add token in URL', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    api.token = "foo";
    const route = "login";
    const expected= "/auth/login?foo=bar&bearer=foo"

    expect(api.buildUrl(route, {foo: 'bar'}, true)).toEqual(expected);
  });

  it('Should buildUrl add token in URL without parameters', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    api.token = "foo";
    const route = "login";
    const expected= "/auth/login?bearer=foo"

    expect(api.buildUrl(route, null, true)).toEqual(expected);
  });

  it('Should buildUrl not add token in URL', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    const route = "login";
    const expected= "/auth/login"

    expect(api.buildUrl(route, null, true)).toEqual(expected);
  });

  it('Should buildUrl without route throw an error', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();

    expect(() => api.buildUrl()).toThrow();
  });

  it('Should addTokenInParameters without parameters not crash', () => {
    axios.create.mockReturnValue(axios);

    const api = new Api();
    api.token = "foo";
    const expected= {bearer: "foo"};

    expect(api.addTokenInParameters()).toEqual(expected);
  });

  it('Should buildApiErrorMessage returns i18n', async () => {
    const expected = "translated";
    axios.create.mockReturnValue(axios);
    i18n.exists.mockReturnValue(true);
    i18n.t.mockReturnValue(expected);

    const api = new Api();
    expect(api.buildApiErrorMessage('route', 'error')).toEqual(expected);
  });

});
