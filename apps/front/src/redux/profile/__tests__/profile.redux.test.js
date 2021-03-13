/**
 * Profile Redux Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import * as reducers from '../reducers';
import * as constants from '../constants';
import { api } from '../../../api';

// Mock API
jest.mock('../../../api');

// Mock Store
const mockStore = configureMockStore([thunk]);

describe('Profile Action GetProfile', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock store
    store = mockStore({
      api: {
        token: {
          pending: false,
          token: 'token',
          error: null,
        },
      },
      app: { locale: 'en' },
    });
  });

  it('Should getProfile action return a valid profile', async () => {
    const profile = {
      profile: {
        firstname: 'foo',
        lastname: 'bar',
      },
    };
    // Mock api.post
    api.get.mockResolvedValue({
      data: profile,
    });

    // Expected actions
    const expectedActions = [
      { type: constants.GET_PROFILE_STARTED },
      { type: constants.GET_PROFILE_SUCCESS, payload: profile },
    ];

    // Call getProfile with success
    await store.dispatch(actions.getProfile()).then(() => {
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
      expect(api.get.mock.calls.length).toBe(1);
    });
  });

  it('Should getProfile action return an error', async () => {
    const resp = new Error('baz');
    api.get.mockRejectedValue(resp);

    // Expected actions
    const expectedActions = [
      { type: constants.GET_PROFILE_STARTED },
      { type: constants.GET_PROFILE_ERROR, payload: 'baz' },
    ];

    // Call getProfile with error
    await store.dispatch(actions.getProfile()).catch(() => {
      expect(api.get.mock.calls.length).toBe(1);
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedActions));
    });
  });
});

describe('Profile Redux Actions', () => {
  let initialValue;

  beforeEach(() => {
    initialValue = reducers.initialValue;
  });

  it('Should apiProfileReducer return new state for action getProfileStarted', () => {
    expect(reducers.apiProfileReducer(initialValue, actions.getProfileStarted())).toEqual({
      pending: true,
      data: null,
      error: null,
    });
  });

  it('Should apiProfileReducer return new state for action getProfileSuccess', () => {
    const $expectedProfile = {
      foo: 'bar',
      baz: ['qux', 'quux'],
    };

    expect(reducers.apiProfileReducer(initialValue, actions.getProfileSuccess($expectedProfile))).toEqual({
      pending: false,
      data: $expectedProfile,
      error: null,
    });
  });

  it('Should apiProfileReducer return new state for action getProfileError', () => {
    expect(reducers.apiProfileReducer(initialValue, actions.getProfileError('bar'))).toEqual({
      pending: false,
      data: null,
      error: 'bar',
    });
  });

  it('Should apiProfileReducer return same state for not defined action', () => {
    expect(reducers.apiProfileReducer()).toEqual({
      pending: false,
      data: null,
      error: null,
    });
  });
});
