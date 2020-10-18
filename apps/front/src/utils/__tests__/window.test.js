/**
 * Scroll Utility Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import * as scroll from '../window';

describe('Scroll Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML =
      '<div style="height: 150px;">' +
      '  <span id="username" />' +
      '  <button id="button" class="button" />' +
      '</div>';

    // Default size
    global.innerWidth = 1024;
    global.innerHeight = 768;

    // Default location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/foo'
      }
    });
  });

  it('Should getElementHeight returns without crash', () => {
    expect(scroll.getElementHeight(document.getElementById('username'))).toBe(0);
    expect(scroll.getElementHeight()).toBe(0);
    expect(scroll.getElementHeight('username', 'id')).toBe(0);
    expect(scroll.getElementHeight('div', 'tag')).toBe(0);
    expect(scroll.getElementHeight('section', 'tag')).toBe(0);
    expect(scroll.getElementHeight('button', 'class')).toBe(0);
    expect(scroll.getElementHeight('unknown', 'class')).toBe(0);
  });

  it('Should getScrollPosition returns without crash', () => {
    const expected = { x: 0, y: 0 };
    expect(scroll.getScrollPosition()).toEqual(expected);
    expect(scroll.getScrollPosition(document.body)).toEqual(expected);
  });

  it('Should getWindowResolution returns without crash', () => {
    const expected = { height: 768, width: 1024 };
    expect(scroll.getWindowResolution()).toEqual(expected);
  });

  it('Should getWindowResolution returns without crash', () => {
    const expected = '/foo';
    expect(scroll.getCurrentWindowPathname()).toEqual(expected);
  });
});
