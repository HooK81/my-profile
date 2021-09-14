/* istanbul ignore file */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <RouterScrollToTop>
          <App />
        </RouterScrollToTop>
      </BrowserRouter>
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
