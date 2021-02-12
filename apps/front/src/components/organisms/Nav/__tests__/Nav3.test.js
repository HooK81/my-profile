/**
 * Nav Test Suites with scroll on home page
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { getScrollPosition, getElementHeight, getCurrentWindowPathname } from '../../../../utils/window';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));
jest.mock('i18next-xhr-backend');
jest.mock('../../../../utils/window');

import { Nav } from '../Nav.js';

describe('Nav with scroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    global.innerHeight = 5000;
    global.innerWidth = 2000;
  });

  it('Should Nav change state to opaque on scroll', async () => {
    getScrollPosition.mockReturnValue({
      x: 0,
      y: 0,
    });
    getElementHeight.mockReturnValue(0);
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} home={true} />);
    // Menu should be opaque
    expect(wrapper.find('#nav-wrap.opaque')).toHaveLength(1);

    await act(async () => {
      getCurrentWindowPathname.mockReturnValue('/');
      global.dispatchEvent(new Event('scroll'));

      await new Promise((done) =>
        setTimeout(() => {
          // Menu still be opaque
          wrapper.update();
          expect(wrapper.find('#nav-wrap.opaque')).toHaveLength(1);
          done();
        }, 1000),
      );
    });
  });

  it('Should Nav change state to transparent on scroll', async () => {
    getScrollPosition.mockReturnValue({
      x: 0,
      y: 0,
    });
    getElementHeight.mockReturnValue(500);
    getCurrentWindowPathname.mockReturnValue('/');
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} home={true} />);

    await act(async () => {
      global.dispatchEvent(new Event('scroll'));

      await new Promise((done) =>
        setTimeout(() => {
          wrapper.update();
          expect(wrapper.find('#nav-wrap.transparent')).toHaveLength(1);
          done();
        }, 1000),
      );
    });
  });

  it('Should Nav change state to hidden on scroll', async () => {
    getScrollPosition.mockReturnValue({
      x: 0,
      y: 200,
    });
    getElementHeight.mockReturnValue(400);
    getCurrentWindowPathname.mockReturnValue('/');

    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} home={true} />);

    await act(async () => {
      global.dispatchEvent(new Event('scroll'));

      await new Promise((done) =>
        setTimeout(() => {
          wrapper.update();
          expect(wrapper.find('#nav-wrap.hidden')).toHaveLength(1);
          done();
        }, 1000),
      );
    });
  });

  it('Should Nav change state to opaque when location change', async () => {
    getScrollPosition.mockReturnValue({
      x: 0,
      y: 0,
    });
    getElementHeight.mockReturnValue(0);
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} home={true} />);
    // Menu should be opaque
    expect(wrapper.find('#nav-wrap.opaque')).toHaveLength(1);

    await act(async () => {
      getCurrentWindowPathname.mockReturnValue('/foo');
      global.dispatchEvent(new Event('scroll'));

      await new Promise((done) =>
        setTimeout(() => {
          // Menu still be opaque
          wrapper.update();
          expect(wrapper.find('#nav-wrap.opaque')).toHaveLength(1);
          done();
        }, 1000),
      );
    });
  });
});
