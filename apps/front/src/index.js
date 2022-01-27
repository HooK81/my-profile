/* istanbul ignore file */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import reportWebVitals from './reportWebVitals';
import './utils/i18n';
import './utils/toastify';
import { RouterScrollToTop } from './components/atoms/RouterScrollToTop/RouterScrollToTop';
import { ConnectedApp, NewAppConnected } from './App';
import { store } from './utils/configureStore';
import { sendVitalsToAnalytics } from './utils/ga';

/**
 * MyProfile
 */

// Render App
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback="loading">
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY}
          scriptProps={{ async: true }}
          useRecaptchaNet={true}
        >
          <BrowserRouter>
            <RouterScrollToTop>
              <ConnectedApp />
            </RouterScrollToTop>
          </BrowserRouter>
        </GoogleReCaptchaProvider>
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendVitalsToAnalytics);
