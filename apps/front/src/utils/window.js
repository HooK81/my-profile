/**
 * Window Utility
 * @author Julien CROCHET <julien@crochet.me>
 */

const isBrowser = typeof window !== `undefined`;
const useWindow = false;

/**
 * Get element scroll position
 * @param {object} element HTML Element
 */
export function getScrollPosition(element = null) {
  /* istanbul ignore next */
  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element : document.body;
  const position = target.getBoundingClientRect();

  /* istanbul ignore next */
  return useWindow ? { x: window.scrollX, y: window.scrollY } : { x: position.left, y: Math.abs(position.top) };
}

/**
 * Get element height
 * @param {object|string} element HTML Element
 * @param {string} kind Kind of element when it is a string. Can be id, tag or class
 * @returns int
 */
export function getElementHeight(element = null, kind = null) {
  let target = null;
  if (typeof element === 'string') {
    if (kind === 'id') {
      target = document.getElementById(element);
    } else if (kind === 'tag') {
      const list = document.getElementsByTagName(element);
      if (list.length > 0) {
        target = list[0];
      }
    } else {
      //Assume it is class
      const list = document.getElementsByClassName(element);
      if (list.length > 0) {
        target = list[0];
      }
    }
  } else {
    target = element;
  }

  if (target) {
    return target.clientHeight;
  }
  return 0;
}

/**
 * Get resolution
 */
export function getWindowResolution() {
  return {
    height: document.documentElement?.clientHeight || window.innerHeight,
    width: document.documentElement?.clientWidth || window.innerWidth,
  };
}

/**
 * Get current location pathname from window
 */
export function getCurrentWindowPathname() {
  return window.location.pathname;
}
