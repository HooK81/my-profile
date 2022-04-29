/**
 * MyProfile App
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { Route, Switch, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import debounce from 'lodash/debounce';
import {
  selectApiProfileData,
  selectApiProfileError,
} from './redux/profile/selectors';
import { selectApiTokenError } from './redux/token/selectors';
import { selectAppIsLoaded, selectAppLocale } from './redux/app/selectors';
import { getProfile } from './redux/profile/actions';
import { setIsLoaded } from './redux/app/actions';
import moment from 'moment';

import './App.scss';
import { AppLoader } from './components/molecules/AppLoader/AppLoader';
import { Home } from './components/pages/Home/Home';
import { AboutSite } from './components/pages/AboutSite/AboutSite';
import { Footer } from './components/organisms/Footer/Footer';
import { Error } from './components/pages/Error/Error';

/**
 * App Component
 */
class App extends PureComponent {
  componentDidMount() {
    // Get Profile
    this.props.getProfile();
  }

  componentDidUpdate(prevProps) {
    // Reload page when user was on error page cauded by API and change location
    if (
      this.props.apiError &&
      prevProps.location.key !== this.props.location.key
    ) {
      this.props.setIsLoaded(false);
      window.location.reload();
    }

    // Reload profile when user change locale
    if (
      this.props.isLoaded &&
      this.props.appLocale !== prevProps.appLocale &&
      !this.props.apiError
    ) {
      this.props.getProfile().catch(() => {});
    }

    // User change locale
    if (this.props.appLocale !== prevProps.appLocale) {
      // Update HTML lang attribute
      document.documentElement.lang = this.props.appLocale;
      // Init moment
      moment.locale(this.props.appLocale);
    }

    // Set title after profile loaded
    if (this.props.isLoaded && !this.props.apiError) {
      document.title = `${this.props.profile.main.firstName} - ${this.props.profile.main.occupation}`;
    }

    // Call React GA on location change
    if (
      prevProps.isLoaded !== this.props.isLoaded ||
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.hash !== this.props.location.hash
    ) {
      this.updateReactGA(
        this.props.location.pathname +
          (this.props.location.hash ? this.props.location.hash : ''),
      );
    }
  }

  updateReactGA = debounce((path) => {
    ReactGA.pageview(path.replace('#home', ''));
  }, 1000);

  render() {
    if (!this.props.isLoaded) {
      return <AppLoader isLoaded={false} />;
    }

    if (this.props.apiError) {
      return (
        <div className="App">
          <AppLoader isLoaded={true} />
          <Switch>
            <Route>
              <Error type="500" message={this.props.apiError} />
            </Route>
          </Switch>
          <Footer />
        </div>
      );
    }

    return (
      <div className="App">
        <AppLoader isLoaded={true} />
        <Switch>
          <Route exact path="/">
            <Home profile={this.props.profile} />
          </Route>
          <Route exact path="/about-site">
            <AboutSite />
          </Route>
          <Route>
            <Error type="404" />
          </Route>
        </Switch>
        <Footer profileMain={this.props.profile.main} />
      </div>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = (state) => ({
  profile: selectApiProfileData(state),
  apiError: selectApiTokenError(state)
    ? selectApiTokenError(state)
    : selectApiProfileError(state),
  isLoaded: selectAppIsLoaded(state),
  appLocale: selectAppLocale(state),
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(getProfile()),
    setIsLoaded: () => dispatch(setIsLoaded()),
  };
};

// Connected App, with Translation
export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(App),
);

export { App };
