/**
 * App Test Suites
 */

import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App.js';
import { AppLoader } from '../components/molecules/AppLoader/AppLoader';
import { Home } from '../components/pages/Home/Home';
import { Error } from '../components/pages/Error/Error';
import { api } from '../api/index';

jest.mock('../api/index');

const profile = {
  main: {},
  resume: {},
};

const location = {
  pathname: '/',
};

Object.defineProperty(window, 'location', {
  writable: true,
  value: { reload: jest.fn() }
});
api.refreshToken = jest.fn();
api.refreshToken.mockResolvedValue('token');

const getProfileResolved = () => {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

const getProfileRejected = () => {
  return new Promise((resolve, reject) => {
    resolve("error");
  });
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.refreshToken.mockResolvedValue('token');
  });

  it('Should App not loaded render without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved} />);
    wrapper.setProps({// use rerender ? https://testing-library.com/docs/example-update-props/
      isLoaded: false,
      appLocale: 'en',
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={false} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
  });

  it('Should App loaded render without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App load profile without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App load profile with error without crash', async () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved} />);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
      apiError: 'error',
      setIsLoaded: jest.fn(),
    });
    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
    await new Promise((done) =>
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find(Error)).toHaveLength(1);
        done();
      }, 1000),
    );
  });

  it('Should App load with token error without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileRejected}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
      apiError: 'err',
      setIsLoaded: jest.fn(),
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
    expect(wrapper.find(Error)).toHaveLength(1);
  });

  it('Should App handle same locale without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);

    wrapper.setProps({
      appLocale: 'en',
    });
    expect(wrapper.find(Home)).toHaveLength(1);
    expect(document.documentElement.lang).toBe('en');
  });

  it('Should App handle locale change without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);
    expect(document.documentElement.lang).toBe('en');

    wrapper.setProps({
      appLocale: 'fr',
    });
    expect(wrapper.find(Home)).toHaveLength(1);
    expect(document.documentElement.lang).toBe('fr');
  });

  it('Should App handle locale change with error without crash', () => {
    const wrapper = shallow(<App location={location} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);

    wrapper.setProps({
      isLoaded: true,
      appLocale: 'fr',
      getProfile: () =>
        new Promise((resolve, reject) => {
          reject();
        }),
      profile: profile,
    });
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App reload when user leave error page', () => {
    const locationError = { pathname: '/', key: 'bla' };
    const locationAfter = { pathname: '/', key: 'bar' };
    const wrapper = shallow(<App location={locationError} getProfile={getProfileResolved}/>);
    wrapper.setProps({
      isLoaded: true,
      appLocale: 'en',
      apiError: 'error',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Error)).toHaveLength(1);

    wrapper.setProps({
      location: locationAfter,
      setIsLoaded: jest.fn(),
    });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
