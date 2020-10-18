/**
 * AppLoader Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { AppLoader } from '../AppLoader.js';

describe('AppLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML = '<div id="site-loader">loading</div>';
  });

  it('Should AppLoader render without crash', () => {
    const wrapper = mount(<AppLoader isLoaded={false} />);
    const loader = document.getElementById('site-loader');
    expect(wrapper.contains(<AppLoader isLoaded={false} />)).toBe(true);
    expect(loader).toBeDefined();
  });

  it('Should AppLoader disappear without crash', async () => {
    const wrapper = mount(<AppLoader isLoaded={true} />);
    expect(wrapper.contains(<AppLoader isLoaded={true} />)).toBe(true);
    await new Promise((done) =>
      setTimeout(() => {
        const loader = document.getElementById('site-loader');
        expect(loader).toBeNull();
        done();
      }, 2000),
    );
  });

  it('Should AppLoader does not crash when dov is missing', async () => {
    document.body.innerHTML = '<div id="other">not a loading</div>';
    const wrapper = mount(<AppLoader isLoaded={true} />);
    expect(wrapper.contains(<AppLoader isLoaded={true} />)).toBe(true);
    await new Promise((done) =>
      setTimeout(() => {
        const loader = document.getElementById('site-loader');
        expect(loader).toBeNull();
        done();
      }, 2000),
    );
  });
});


