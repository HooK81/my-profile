/**
 * Nav Test Suites for home page
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));
jest.mock('i18next-xhr-backend');

import { Nav } from '../Nav.js';
import i18n from 'i18next';

describe('Nav for Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML =
      '<div style="height: 5000px;"><div id="home" style="height: 4000px;">test</div><div id="hash">hash</div></div>';
  });

  it('Should Nav render without crash', () => {
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} />);
    expect(wrapper.find('#nav li')).toHaveLength(2); // 2 = Item & language
  });

  it('Should Nav click mobile button without crash', () => {
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} />);

    // Click on menu button
    wrapper.find('#nav-wrap .mobile-btn-show').simulate('click');
    expect(wrapper.find('#nav-wrap.opened')).toHaveLength(1);

    // Click on hide menu button
    wrapper.find('#nav-wrap .mobile-btn-hide').simulate('click');
    expect(wrapper.find('#nav-wrap.opened')).toHaveLength(0);
  });

  it('Should click outside mobile menu hide menu', () => {
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} />);

    // Click on menu button
    wrapper.find('#nav-wrap .mobile-btn-show').simulate('click');
    expect(wrapper.find('#nav-wrap.opened')).toHaveLength(1);

    // Click outside menu
    act(() => {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', false, true);
      document.dispatchEvent(evt);
    });
    wrapper.update();
    expect(wrapper.find('#nav-wrap.opened')).toHaveLength(0);
  });

  it('Should Nav change language without crash', async () => {
    i18n.changeLanguage = jest.fn();
    i18n.changeLanguage.mockResolvedValue(true);
    const navItems = [{ id: 1, to: { pathname: '/', hash: 'home' }, label: 'Home' }];
    const wrapper = mount(<Nav items={navItems} />);
    expect(wrapper.find('#nav li')).toHaveLength(2); // 2 = Item & language

    await act(async () => {
      wrapper.find('#nav-wrap .languages .language').at(1).simulate('click');
      wrapper.update();
      await new Promise((done) =>
        setTimeout(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(1);
          done();
        }, 1000),
      );
    });

    act(() => {
      wrapper.find('#nav-wrap .languages .language').at(0).simulate('click');
    });
    wrapper.update();
    await new Promise((done) =>
      setTimeout(() => {
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        done();
      }, 1000),
    );
  });

  it('Should Nav set link active after scroll', async () => {
    // Mock rect of hash element
    global.document.getElementById('home').getBoundingClientRect = jest.fn(() => ({
      top: 4000,
      left: 0,
      right: 500,
      bottom: 5000,
      width: 500,
      height: 1000,
    }));
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 500,
      bottom: 1000,
      width: 500,
      height: 1000,
    }));
    const navItems = [
      { id: 2, to: { pathname: '/', hash: 'home' }, label: 'home' },
      { id: 1, to: { pathname: '/', hash: 'hash' }, label: 'hash' },
    ];
    const wrapper = mount(<Nav items={navItems} />);
    // CLick on hash
    wrapper.find('#nav a').at(1).simulate('click');
    await new Promise((done) =>
      setTimeout(() => {
        expect(wrapper.find('#nav a.active')).toHaveLength(1);
        done();
      }, 1000),
    );
  });

  it('Should Nav set link active with custom class after scroll', async () => {
    // Mock rect of hash element
    global.document.getElementById('home').getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 500,
      bottom: 1000,
      width: 500,
      height: 1000,
    }));
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(() => ({
      top: 4000,
      left: 0,
      right: 500,
      bottom: 5000,
      width: 500,
      height: 1000,
    }));
    const navItems = [
      {
        id: 2,
        to: { pathname: '/', hash: 'home' },
        label: 'home',
        smoothItem: false,
        smoothDuration: 0,
        smoothActiveClass: 'custom-class',
      },
      { id: 1, to: { pathname: '/', hash: 'hash' }, label: 'hash' },
    ];
    const wrapper = mount(<Nav items={navItems} />);
    await new Promise((done) =>
      setTimeout(() => {
        expect(wrapper.find('#nav li').at(0).find('a.custom-class')).toHaveLength(1);
        done();
      }, 1000),
    );
  });
});
