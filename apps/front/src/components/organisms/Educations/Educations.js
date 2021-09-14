/**
 * Educations
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Education } from '../../molecules/Education/Education';
import { useTranslation } from 'react-i18next';
import './Educations.scss';

/**
 * Educations Component
 * @param {object} props
 */
export function Educations(props) {
  const { t } = useTranslation();

  // Process each hobby
  const educations = props.educations.map(function (education, i) {
    return (
      <Education
        key={i}
        school={education.school}
        city={education.city}
        date={education.date}
        degree={education.degree}
        description={education.description}
      />
    );
  });

  return (
    <div className="row educations">
      <div className="three column header-col">
        <h1>
          <span>{t('resume.educations.title')}</span>
        </h1>
      </div>

      <div className="nine column main-col">
        <div className="row item">
          <div className="twelve column">{educations}</div>
        </div>
      </div>
    </div>
  );
}

Educations.defaultProps = {
  educations: [],
};

/* istanbul ignore next */
Educations.propTypes = {
  educations: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    _location,
    propName,
  ) {
    if (
      !('school' in propValue[key]) ||
      !('degree' in propValue[key]) ||
      !('city' in propValue[key]) ||
      !('date' in propValue[key])
    ) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  }).isRequired,
};
