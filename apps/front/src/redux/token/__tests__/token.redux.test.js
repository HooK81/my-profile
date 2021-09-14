/**
 * Token Redux Test Suites
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as reducers from '../reducers';
import * as constants from '../constants';
import * as appConstants from '../../app/constants';
import { api } from '../../../api';
jest.mock('../../../api'); // automatic API mock
const mockStore = configureMockStore([thunk]); // Store mock

describe('Token Action GetToken', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store
    store = mockStore({
      api: {
        token: {},
      },
    });
  });

  it('Should getToken action return a valid token', async () => {
    // Mock api.getCredentials()
    api.getCredentials.mockReturnValue({
      username: 'user',
      password: 'pwd',
      key: 'key',
    });
    // Mock api.post
    api.post.mockResolvedValue({
      data: {
        token: 'token',
      },
    });

    // Expected actions
    const expectedActions = [{ type: constants.API_TOKEN_STARTED }, { type: constants.API_TOKEN_SUCCESS, payload: 'token' }];

    // Call getToken with success
    await store.dispatch(actions.getToken()).then(() => {
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      );
      expect(api.post.mock.calls.length).toBe(1);
    });
  });

  it('Should getToken action return an error', async () => {
    // Mock api.getCredentials()
    api.getCredentials.mockReturnValue({
      username: 'user',
      password: 'pwd',
      key: 'key',
    });

    const resp = new Error('foo');
    api.post.mockRejectedValue(resp);

    // Expected actions
    const expectedActions = [{ type: constants.API_TOKEN_STARTED }, { type: constants.API_TOKEN_ERROR, payload: 'foo' }, { type: appConstants.IS_LOADED, payload: true }];

    // Call getToken with error
    await store.dispatch(actions.getToken()).catch(() => {
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      );
      expect(api.post.mock.calls.length).toBe(1);
    });
  });
});

describe('Token Redux Actions', () => {
  let initialValue;

  beforeEach(() => {
    initialValue = reducers.initialValue;
  });

  it('Should apiTokenReducer return new state for action getTokenStarted', () => {
    expect(reducers.apiTokenReducer(initialValue, actions.getTokenStarted())).toEqual({
      pending: true,
      token: null,
      error: null,
    });
  });

  it('Should apiTokenReducer return new state for action getTokenSuccess', () => {
    expect(reducers.apiTokenReducer(initialValue, actions.getTokenSuccess('foo'))).toEqual({
      pending: false,
      token: 'foo',
      error: null,
    });
  });

  it('Should apiTokenReducer return new state for action getTokenError', () => {
    expect(reducers.apiTokenReducer(initialValue, actions.getTokenError('bar'))).toEqual({
      pending: false,
      token: null,
      error: 'bar',
    });
  });

  it('Should apiTokenReducer return same state for not defined action', () => {
    expect(reducers.apiTokenReducer()).toEqual({
      pending: false,
      token: null,
      error: null,
    });
  });
});
