/**
 * App Test Suites
 * @author Julien CROCHET <julien@crochet.me>
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

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.location.reload = jest.fn();
    api.refreshToken = jest.fn();
    api.refreshToken.mockResolvedValue('token');
  });

  it('Should App not loaded render without crash', () => {
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: false,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={false} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
  });

  it('Should App loaded render without crash', () => {
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App load profile without crash', () => {
    api.refreshToken.mockResolvedValue('token');

    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App load profile with error without crash', async () => {
    const pushMock = jest.fn();
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          reject();
        }),
      profile: profile,
      apiError: 'error',
      setIsLoaded: jest.fn(),
      history: {
        push: pushMock,
      },
    });
    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
    await new Promise((done) =>
      setTimeout(() => {
        wrapper.update();
        expect(pushMock).toHaveBeenCalledWith('/error');
        done();
      }, 1000),
    );
  });

  it('Should App load with token error without crash', () => {
    const pushMock = jest.fn();
    api.refreshToken.mockRejectedValue('err');

    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      profile: profile,
      apiError: 'err',
      setIsLoaded: jest.fn(),
      history: {
        push: pushMock,
      },
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(0);
    expect(pushMock).toHaveBeenCalledWith('/error');
  });

  it('Should App handle same locale without crash', () => {
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);

    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App handle locale change without crash', () => {
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);

    wrapper.setProps({
      isLoaded: true,
      locale: 'fr',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App handle locale change with error without crash', () => {
    const wrapper = shallow(<App location={location} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Home)).toHaveLength(1);

    wrapper.setProps({
      isLoaded: true,
      locale: 'fr',
      getProfile: () =>
        new Promise((resolve, reject) => {
          reject();
        }),
      profile: profile,
    });
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('Should App reload when user leave error page', () => {
    const locationError = { pathname: '/error' };
    const wrapper = shallow(<App location={locationError} />);
    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      apiError: 'error',
      profile: profile,
    });

    expect(wrapper.containsMatchingElement(<AppLoader isLoaded={true} />)).toBe(true);
    expect(wrapper.find(Error)).toHaveLength(1);

    wrapper.setProps({
      isLoaded: true,
      locale: 'en',
      apiError: 'error',
      getProfile: () =>
        new Promise((resolve, reject) => {
          resolve();
        }),
      profile: profile,
      location: location,
      setIsLoaded: jest.fn(),
    });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
