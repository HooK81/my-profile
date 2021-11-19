/* istanbul ignore file */

import { createBrowserHistory } from 'history';
import ReactGA, { ga } from 'react-ga';

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

const sendVitalsToAnalytics = ({ id, name, value }) => {
  ga('send', 'event', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    eventLabel: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate
  });
};

export { ReactGA, sendVitalsToAnalytics };
