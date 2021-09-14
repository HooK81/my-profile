/* istanbul ignore file */
/**
 * FOS JS Routing
 * To generate routes.json :
 * php bin/console fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json
 */

import Routing from './router';
import routes from './fos_js_routes.json';

if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_API_ABSOLUTE_OVERRIDE_HOST
) {
  routes.host = process.env.REACT_APP_API_ABSOLUTE_OVERRIDE_HOST;
  routes.port = process.env.REACT_APP_API_ABSOLUTE_OVERRIDE_PORT;
  routes.scheme =
    process.env.REACT_APP_API_ABSOLUTE_OVERRIDE_PROTOCOL.substring(
      0,
      process.env.REACT_APP_API_ABSOLUTE_OVERRIDE_PROTOCOL.length - 1,
    );
} else if (window) {
  routes.host = window.location.hostname;
  routes.port = window.location.port;
  routes.scheme = window.location.protocol.substring(
    0,
    window.location.protocol.length - 1,
  );
}

// Set data
Routing.setRoutingData(routes);
// Update base URL
Routing.setBaseUrl(process.env.REACT_APP_API_BASE_URL);

/**
 * Routing class
 * Override default method generate for absolute URL
 */
class AppRouting {
  /**
   * Get an URL from given route name
   * @param {string} name
   * @param {Object.<string, string>} opt_params
   * @param {boolean} absolute
   * @return {string}
   */
  generate(name, opt_params, absolute = undefined) {
    return Routing.generate(name, opt_params, absolute);
  }
}
const routing = new AppRouting();

export { routing };
