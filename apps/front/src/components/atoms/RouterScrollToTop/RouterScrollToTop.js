/**
 * RouterScrollToTop
 * @author Julien CROCHET <julien@crochet.me>
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouterScrollToTop Component
 * When pathname change from router, scroll to top of page
 * @param {object} props
 */
export function RouterScrollToTop(props) {
  const location = useLocation();
  const { children } = props;

  useEffect(() => {
    if (location.pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return children;
}
