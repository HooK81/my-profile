/**
 * Hobbies
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
   * Add imageSrc property into hobby
   * @param {*} hobby
   * @returns {Object}
   */
  const addHobbyImageSrcProp = async (hobby) => {
    const getImageSrc = async (filename) => {
      try {
        return (await import(`./assets/${filename}`)).default;
      } catch (e) {
        console.error(`Missing assets in Hobbies [${filename}]`, e);
        return (await import('./assets/missing.png')).default;
      }
    };

    return {
      ...hobby,
      imageSrc: await getImageSrc(hobby.image),
    };
  };

  useEffect(() => {
    (async () => {
      // Generate a promises array for lazy loading of each hobby image
      const hobbiesPromises = props.hobbies.map((hobby) =>
        addHobbyImageSrcProp(hobby),
      );
      // Build hobbies
      const hobbies = (await Promise.all(hobbiesPromises)).map((hobby, i) => (
        <Hobby
          key={i}
          title={hobby.title}
          image={hobby.imageSrc}
          icon={hobby.icon}
        />
      ));
      // Set all elements into state for rendering
      setHobbies(hobbies);
    })();
  }, [props.hobbies]);

  const { t } = useTranslation();

  return (
    <section id="hobbies">
      <div className="row">
        <div className="twelve column collapsed">
          <h1>{t('hobbies.title')}</h1>
          <div
            id="hobbies-wrapper"
            className="bgrid bgrid-quarters s-bgrid-thirds"
          >
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
  hobbies: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    _location,
    propName,
  ) {
    if (
      !('title' in propValue[key]) ||
      !('image' in propValue[key]) ||
      !('icon' in propValue[key])
    ) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  }).isRequired,
};
