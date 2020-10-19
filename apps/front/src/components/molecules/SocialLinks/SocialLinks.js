/**
 * Social Links
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import PropTypes from 'prop-types';
import './SocialLinks.scss';

/**
 * Social Links Component
 * @param object props
 */
export function SocialLinks(props) {
  // Process each social network
  const networks = props.networks.map(function (network) {
    return (
      <li key={network.name}>
        <a href={network.url} target="_blank" rel="noopener noreferrer">
          <i className={network.icon}></i>
        </a>
      </li>
    );
  });

  return <ul className="social">{networks}</ul>;
}

/* istanbul ignore next */
SocialLinks.propTypes = {
  networks: PropTypes.arrayOf(function (propValue, key, componentName, location, propName) {
    if (
      !propValue[key].hasOwnProperty('name') ||
      !propValue[key].hasOwnProperty('url') ||
      !propValue[key].hasOwnProperty('icon')
    ) {
      return new Error(`Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`);
    }
  }).isRequired,
};
