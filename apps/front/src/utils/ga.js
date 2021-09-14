/* istanbul ignore file */

import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

// Google Analytics
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_SITE_KEY, {
  debug: false,
  gaOptions: {
    siteSpeedSampleRate: 100,
  },
});

// On History Change
const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.pageview(location.pathname + (location.hash ? location.hash : ''));
});

export default ReactGA;
