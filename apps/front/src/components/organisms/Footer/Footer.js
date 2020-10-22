/**
 * Footer
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
