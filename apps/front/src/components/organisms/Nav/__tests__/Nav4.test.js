/**
 * Nav Test Suites when changing page
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history'
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

// Do not use react-router-dom default mocks for this test
const originalModule = jest.requireActual('react-router-dom');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}));
import {Router, Route } from 'react-router-dom'

import { Nav } from '../Nav.js';

describe('Nav with changing page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Nav change change page', async () => {
    const history = createMemoryHistory()
    const navItems = [
      { id: 1, to: { pathname: '/', hash: 'home' }, label: 'foo' },
      { id: 0, to: { pathname: '/about-site' }, label: 'bar' },
    ];
    const wrapper = mount(
      <Router history={history}>
          <Nav items={navItems}></Nav>
          <Route exact path="/">Home</Route>
          <Route path="/about-site">This is about page</Route>
      </Router>,
    );

    // Change page
    await act(async() => {
      history.push('/about-site');
      // wait
      await new Promise((done) =>
      setTimeout(() => {
          wrapper.update();
          done();
        }, 300),
      );
    });
    expect(wrapper.html()).toContain('This is about page');
  });
});
