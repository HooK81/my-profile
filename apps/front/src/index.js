/* istanbul ignore file */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import './utils/i18n';
import './utils/toastify';
import { RouterScrollToTop } from './components/atoms/RouterScrollToTop/RouterScrollToTop';
import App from './App';
import * as serviceWorker from './utils/serviceWorker';
import { store } from './utils/configureStore';
import './utils/ga';

/**
 * MyProfile
 */

// Render App
ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback="loading">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY}
        scriptProps={{ async: true }}
        useRecaptchaNet={true}
      >
        <BrowserRouter>
          <RouterScrollToTop>
            <App />
          </RouterScrollToTop>
        </BrowserRouter>
      </GoogleReCaptchaProvider>
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
