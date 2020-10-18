/**
 * AppLoader Component
 * Caution DOM is outside react for displaying before render
 * @author Julien CROCHET <julien@crochet.me>
 */

import { PureComponent } from 'react';
import PropTypes         from 'prop-types';
import                        './AppLoader.scss';

/**
 * App Loader Component
 */
export class AppLoader extends PureComponent {
  constructor(props) {
    super(props);
    this.loaderTimeout = null;
    this.loader = document.getElementById('site-loader');
  }

  componentDidMount() {
    if (this.props.isLoaded && !this.loaderTimeout) {
      // Hide loader when app is loaded
      this.loaderTimeout = setTimeout(this.hideLoader, 500);
    }
  }

  /**
   * Hide then Remove main loader which is outside react
   */
  hideLoader = () => {
    if (!this.loader) {
      return;
    }
    this.loader.classList.add('hide');
    setTimeout(this.removeLoader, 500);
  };

  /**
   * Remove loader
   */
  removeLoader = () => {
    this.loader.parentNode.removeChild(this.loader);
  };

  render() {
    // Nothing to render. DOM is not in react
    return null;
  }
}

/* istanbul ignore next */
AppLoader.propTypes = {
  isLoaded: PropTypes.bool.isRequired
};
