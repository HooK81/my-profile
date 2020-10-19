/**
 * Hobby
 * @author Julien CROCHET <julien@crochet.me>
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Hobby.scss';

/**
 * Hobby Component
 * @param {object} props
 */
export function Hobby(props) {
  const [isHover, setIsHover] = useState(false);
  const [image, setImage] = useState('');

  // Load image dynamicaly
  useEffect(() => {
    const loadImage = (imageName) => {
      import(`./assets/${imageName}`).then((image) => {
        setImage(image.default);
      });
    };

    loadImage(props.image);
  }, [props.image]);

  let overlay = null;
  if (isHover) {
    // overlay content
    overlay = (
      <div className="hobby-item-meta">
        <h5>
          <i className={props.icon}></i>
        </h5>
        <hr />
        <p>{props.title}</p>
      </div>
    );
  }
  const overlayClass = isHover ? 'hover' : '';

  return (
    <div className="bgrid-column hobby-item">
      <div className="item-wrap" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        {image && <img alt={props.title} src={image} />}
        <div className={`overlay ${overlayClass}`}>{overlay}</div>
      </div>
    </div>
  );
}

Hobby.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
