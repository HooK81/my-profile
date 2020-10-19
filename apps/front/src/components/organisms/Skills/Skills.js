/**
 * Skills
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Bars } from '../../molecules/Bars/Bars';
import { getWindowResolution } from '../../../utils/window';

import './Skills.scss';

/**
 * Skills Component
 * @param {object} props
 */
export function Skills(props) {
  const { t } = useTranslation();
  const [resolution, setResolution] = useState(getWindowResolution());
  const [hasOneCol, setOneCol] = useState(resolution.width < 768);

  // Show one or two columns depending screen
  /* istanbul ignore next */
  useEffect(() => {
    function handleResize() {
      setResolution(getWindowResolution());
    }
    window.addEventListener('resize', handleResize);
    setOneCol(resolution.width < 768);

    return () => window.removeEventListener('resize', handleResize);
  }, [resolution]);

  const evenSkills = !hasOneCol ? props.skills.filter((skill, i) => i % 2 === 0) : null;
  const oddSkills = !hasOneCol ? props.skills.filter((skill, i) => i % 2 !== 0) : null;

  return (
    <div className="skills">
      <div className="row">
        <div className="three column header-col">
          <h1>
            <span>{t('resume.skills.title')}</span>
          </h1>
        </div>
        <div className="nine column main-col">
          <p className="lead">{t('resume.skills.desc')}</p>
        </div>
      </div>
      <div className="row">
        <div className="three column"></div>
        {hasOneCol && (
          <div className="nine column main-col">
            <Bars items={props.skills} />
          </div>
        )}
        {!hasOneCol && (
          <>
            <div className="nine-half column first-col">
              <Bars items={evenSkills} />
            </div>
            <div className="nine-half column second-col">
              <Bars items={oddSkills} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Skills.defaultProps = {
  skills: [],
};
/* istanbul ignore next */
Skills.propTypes = {
  skills: PropTypes.arrayOf(function (propValue, key, componentName, location, propName) {
    if (!propValue[key].hasOwnProperty('name') || !propValue[key].hasOwnProperty('level')) {
      return new Error(`Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`);
    }
  }).isRequired,
};
