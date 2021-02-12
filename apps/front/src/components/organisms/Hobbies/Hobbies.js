/**
 * Hobbies
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Hobby } from '../../molecules/Hobby/Hobby';
import { useTranslation } from 'react-i18next';
import './Hobbies.scss';

/**
 * Hobbies Component
 * @param {object} props
 */
export function Hobbies(props) {
  // Process each hobby
  const hobbies = props.hobbies.map(function (hobby, i) {
    return <Hobby key={i} title={hobby.title} image={hobby.image} icon={hobby.icon} />;
  });
  const { t } = useTranslation();

  return (
    <section id="hobbies">
      <div className="row">
        <div className="twelve column collapsed">
          <h1>{t('hobbies.title')}</h1>
          <div id="hobbies-wrapper" className="bgrid bgrid-quarters s-bgrid-thirds">
            {hobbies}
          </div>
        </div>
      </div>
    </section>
  );
}

Hobbies.defaultProps = {
  hobbies: [],
};
/* istanbul ignore next */
Hobbies.propTypes = {
  hobbies: PropTypes.arrayOf(function (propValue, key, componentName, location, propName) {
    if (
      !propValue[key].hasOwnProperty('title') ||
      !propValue[key].hasOwnProperty('image') ||
      !propValue[key].hasOwnProperty('icon')
    ) {
      return new Error(`Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`);
    }
  }).isRequired,
};
