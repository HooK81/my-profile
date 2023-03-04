/* istanbul ignore file */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './utils/i18n';
import { RouterScrollToTop } from './components/atoms/RouterScrollToTop/RouterScrollToTop';
import App from './App';
import { store } from './utils/configureStore';
import { ToastContainer } from 'react-toastify';

/**
 * MyProfile
 */

// Render App
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback="loading">
        <BrowserRouter>
          <RouterScrollToTop>
            <App />
            <ToastContainer autoClose={8000} position="top-center" />
          </RouterScrollToTop>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(false);
