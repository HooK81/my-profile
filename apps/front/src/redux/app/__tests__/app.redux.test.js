/**
 * App Redux Test Suites
 */

import * as actions from '../actions';
import * as reducers from '../reducers';

describe('App Redux Reducer & Action', () => {
  let initialValue;

  beforeEach(() => {
    initialValue = {
      isLoaded: false,
    };
  });

  it('Should appReducer return new state for action setIsLoaded', () => {
    expect(reducers.appReducer(initialValue, actions.setIsLoaded())).toEqual({
      isLoaded: true,
    });
  });

  it('Should appReducer return new state for action setLocale', () => {
    expect(reducers.appReducer(initialValue, actions.setLocale('en'))).toEqual({
      isLoaded: false,
      locale: 'en',
    });
  });

  it('Should appReducer return same state for empty action', () => {
    expect(reducers.appReducer(initialValue, {})).toEqual({
      isLoaded: false,
    });
  });

  it('Should appReducer return same state for not defined action', () => {
    expect(reducers.appReducer()).toEqual({
      isLoaded: false,
      locale: null
    });
  });
});
