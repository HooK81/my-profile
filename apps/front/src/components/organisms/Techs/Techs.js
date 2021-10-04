/**
 * Fav Techs
 */
import { useState, useEffect } from 'react';
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

  /**
   * Add imageSrc property into tech object
   * @param {*} tech
   * @returns {Object}
   */
  const addTechImageSrcProp = async (tech) => {
    const getImageSrc = async (filename) => {
      try {
        return (await import(`./assets/${filename}`)).default;
      } catch (e) {
        console.error(`Missing assets in Techs [${filename}]`, e);
        return (await import('./assets/missing.png')).default;
      }
    };

    return {
      ...tech,
      imageSrc: await getImageSrc(tech.image),
    };
  };

  useEffect(() => {
    (async () => {
      // Generate a promises array for lazy loading of each tech element
      const techsPromises = props.techs.map((tech) =>
        addTechImageSrcProp(tech),
      );
      // Build techs
      const techs = (await Promise.all(techsPromises)).map((tech, i) => (
        <li key={i} className="bgrid-column feature-item">
          <img alt={tech.name} src={tech.imageSrc} width="100%" />
          <h5>{tech.name}</h5>
          <p>{tech.desc}</p>
        </li>
      ));
      // Set all elements into state for rendering
      setTechs(techs);
    })();
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
  techs: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    _location,
    propName,
  ) {
    if (
      !('name' in propValue[key]) ||
      !('image' in propValue[key]) ||
      !('desc' in propValue[key])
    ) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  }).isRequired,
};
