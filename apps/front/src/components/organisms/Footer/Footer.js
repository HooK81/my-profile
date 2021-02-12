/**
 * Footer
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CookieConsent from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';
import { ProtectedText } from 'react-protected-text';
import { SocialLinks } from '../../molecules/SocialLinks/SocialLinks';
import { ScrollButton } from '../../atoms/ScrollButton/ScrollButton';
import './Footer.scss';

/**
 * Footer Component
 * @param {object} props
 */
export function Footer(props) {
  const year = moment().year();
  const { t } = useTranslation();

  return (
    <footer>
      <div className="row">
        <div className="twelve column">
          <SocialLinks networks={props.profileMain.social} />
          <ul className="copyright">
            <li>
              v{process.env.REACT_APP_VERSION} &copy; Copyright {year}{' '}
              <ProtectedText text={props.profileMain.fullName} />
            </li>
          </ul>
        </div>
        <ScrollButton type={'top'} />
      </div>
      <CookieConsent
          location="bottom"
          cookieName="cookieConsent"
          expires={999}
          acceptOnScroll={true}
          acceptOnScrollPercentage={5}
          sameSite="strict"
          containerClasses="cookie-consent"
          buttonWrapperClasses="cookie-consent-button"
          buttonText={t('footer.cookie.accept_btn')}
        >
          {t('footer.cookie.message')}
        </CookieConsent>
    </footer>
  );
}

Footer.defaultProps = {
  profileMain: {
    social: [],
    fullName: '',
  },
};

Footer.propTypes = {
  profileMain: PropTypes.object,
};
