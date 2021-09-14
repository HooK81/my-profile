/**
 * Error Page
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Header } from '../../organisms/Header/Header';
import './Error.scss';
import sadness from './images/sadness.jpg';

/**
 * Error Page
 * @param {object} props
 */
export function Error(props) {
  const { t } = useTranslation();

  return (
    <div>
      <Header id="header" />
      <section id="error">
        <div className="row">
          <div className="four column col-image">
            <img className="image" src={sadness} alt=""></img>
          </div>
          <div className="height column col-text">
            <div className="message">
              <h1>{t('error.banner')}</h1>
              <p>
                {t('error.title', { type: props.type })}
                <br />
                {t(`error.messages.${props.type}`)}
              </p>
              {props.message && <p>{props.message}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Error.propTypes = {
  type: PropTypes.oneOf(['404', '500']).isRequired,
  message: PropTypes.string,
};
