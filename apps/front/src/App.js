/**
 * MyProfile App
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { Route, Switch, withRouter } from 'react-router-dom';
import { selectApiProfileData, selectApiProfileError } from './redux/profile/selectors';
import { selectApiTokenError } from './redux/token/selectors';
import { selectAppIsLoaded, selectAppLocale } from './redux/app/selectors';
import { getProfile } from './redux/profile/actions';
import { setIsLoaded } from './redux/app/actions';
import { api } from './api/index';
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
export class App extends PureComponent {
  componentDidMount() {
    // Get Access Token & Profile
    api
      .refreshToken()
      .then(() => {
        this.props.getProfile().catch(() => {});
      })
      .catch(() => {});
  }

  componentDidUpdate(prevProps) {
    // Redirect to error page if API fails
    if (this.props.apiError && this.props.location.pathname !== '/error' && prevProps.location.pathname !== '/error') {
      this.props.setIsLoaded(false);
      this.props.history.push('/error');
    }

    // Reload page when user was on error page cauded by API and change location
    if (prevProps.location.pathname === '/error' && prevProps.location.pathname !== this.props.location.pathname && this.props.apiError) {
      this.props.setIsLoaded(false);
      window.location.reload();
    }

    // Reload profile when user change locale
    if (this.props.isLoaded && this.props.locale !== prevProps.locale && !this.props.apiError) {
      this.props.getProfile().catch(() => {});
    }

    // Init moment when user change locale
    if (this.props.locale !== prevProps.locale ) {
      moment.locale(this.props.locale);
    }

    // Set title after profile loaded
    if (this.props.isLoaded && !this.props.apiError) {
      document.title = this.props.profile.main.name + ' - ' + this.props.profile.main.occupation;
    }
  }

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
          <Footer/>
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
  apiError: selectApiTokenError(state) ? selectApiTokenError(state) : selectApiProfileError(state),
  isLoaded: selectAppIsLoaded(state),
  locale: selectAppLocale(state),
});
/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(getProfile()),
    setIsLoaded: () => dispatch(setIsLoaded()),
  };
};

// Connected App, with Translation
export default withRouter(compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(App));
