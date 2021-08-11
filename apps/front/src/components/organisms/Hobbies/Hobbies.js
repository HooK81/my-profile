/**
 * Hobbies
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Hobby } from '../../molecules/Hobby/Hobby';
import { useTranslation } from 'react-i18next';
import './Hobbies.scss';

/**
 * Hobbies Component
 * @param {object} props
 */
export function Hobbies(props) {
  const [hobbies, setHobbies] = useState([]);

  /**
   * Load images in assets folder
   * @param {*} fileName
   * @returns
   */
  const loadFile = async (fileName) => {
    let imageSrc;

    try {
      await import(`./assets/${fileName}`).then((image) => {
        imageSrc = image.default;
      });
    } catch (e) {
      console.error(`Missing assets in Hobbies [${fileName}]`, e);
      await import(`./assets/missing.png`).then((image) => {
        imageSrc = image.default;
      });
    }

    return imageSrc;
  };

  useEffect(() => {
    // Generate a promises array for lazy loading of each hobby image
    const hobbiesPromises = props.hobbies.map(async function (hobby, i) {
      const imageSrc = await loadFile(hobby.image);

      return <Hobby key={i} title={hobby.title} image={imageSrc} icon={hobby.icon} />;
    });

    Promise.all(hobbiesPromises).then((hobbies) => {
      // Set all elements into state for rendering
      setHobbies(hobbies);
    });
  }, [props.hobbies]);

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
