/**
 * Works
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Work } from '../../molecules/Work/Work';
import { useTranslation } from 'react-i18next';
import './Works.scss';

/**
 * Works Component
 * @param {object} props
 */
export function Works(props) {
  const { t } = useTranslation();

  // Process each hobby
  const works = props.works.map(function (work, i) {
    return (
      <Work
        key={i}
        company={work.company}
        city={work.city}
        date={work.date}
        title={work.title}
        description={work.description}
      />
    );
  });

  return (
    <div className="row works">
      <div className="three column header-col">
        <h1>
          <span>{t('resume.works.title')}</span>
        </h1>
      </div>

      <div className="nine column main-col">
        <div className="row item">
          <div className="twelve column">{works}</div>
        </div>
      </div>
    </div>
  );
}

Works.defaultProps = {
  works: []
}

/* istanbul ignore next */
Works.propTypes = {
  works: PropTypes.arrayOf(function (propValue, key, componentName, location, propName) {
    if (
      !propValue[key].hasOwnProperty('company') ||
      !propValue[key].hasOwnProperty('title') ||
      !propValue[key].hasOwnProperty('date') ||
      !propValue[key].hasOwnProperty('city') ||
      !propValue[key].hasOwnProperty('description')
    ) {
      return new Error(`Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`);
    }
  }).isRequired,
};
