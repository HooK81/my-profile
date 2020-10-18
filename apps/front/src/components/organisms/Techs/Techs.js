/**
 * Fav Techs
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Techs.scss';

/**
 * Fav Techs Component
 * @param {object} props
 */
export function Techs(props) {
  // Process each tech
  const [techs, setTechs] = useState([]);

  useEffect(() => {
      // Generate a promises array for lazy loading of each tech element
    const techsPromises = props.techs.map(async function (tech, i) {
      let imageSrc;
      await import(`./assets/${tech.image}`).then((image) => {
        imageSrc = image.default;
      });

      return (
        <li key={i} className="bgrid-column feature-item">
          <img alt={tech.name} src={imageSrc} width="100%" />
          <h5>{tech.name}</h5>
          <p>{tech.desc}</p>
        </li>
      );
    });
    Promise.all(techsPromises).then((techs) => {
      // Set all elements into state for rendering
      setTechs(techs);
    });
  }, [props.techs]);

  const { t } = useTranslation();

  return (
    <section id="techs">
      <div className="row">
        <div className="three column header-col">
          <h1>
            <span>{t('resume.techs.title')}</span>
          </h1>
        </div>
        <div className="nine column main-col">
          <p className="lead">{t('resume.techs.desc')}</p>
        </div>
      </div>
      <div className="row">
        <div className="twelve column">
          <ul className="bgrid bgrid-quarters s-bgrid-thirds">{techs}</ul>
        </div>
      </div>
    </section>
  );
}

Techs.defaultProps = {
  techs: [],
};
/* istanbul ignore next */
Techs.propTypes = {
  techs: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
    if (
      !propValue[key].hasOwnProperty('name') ||
      !propValue[key].hasOwnProperty('image') ||
      !propValue[key].hasOwnProperty('desc')
    ) {
      return new Error('Invalid prop `' + propFullName + '` supplied to `' + componentName + '`. Validation failed.');
    }
  }).isRequired,
};
