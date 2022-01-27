/**
 * AppLoader Component
 * Caution DOM is outside react for displaying before render
 */

import { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import './AppLoader.scss';

/**
 * App Loader Component
 */
export function AppLoader(props) {
  const loader = document.getElementById('site-loader');

  /**
   * Remove loader
   */
  const removeLoader = useCallback(() => {
    loader.parentNode.removeChild(loader);
  }, [loader]);

  /**
   * Hide then Remove main loader which is outside react
   */
  const hideLoader = useCallback(() => {
    if (!loader) {
      return;
    }
    loader.classList.add('hide');
    setTimeout(removeLoader, 500);
  }, [loader, removeLoader]);

  const [loaderTimeout, setLoaderTimeout] = useState(null);

  useEffect(() => {
    if (props.isLoaded && !loaderTimeout) {
      // Hide loader when app is loaded
      setLoaderTimeout(setTimeout(hideLoader, 500));
    }
  }, [props.isLoaded, loaderTimeout, hideLoader]);

  return null; // Nothing to render. DOM is not in react
}

/* istanbul ignore next */
AppLoader.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
};
