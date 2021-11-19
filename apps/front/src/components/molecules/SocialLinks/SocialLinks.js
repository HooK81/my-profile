/**
 * Social Links
 */
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
        <a href={network.url}>
          <i className={network.icon}></i>
        </a>
      </li>
    );
  });

  return (
    <ul className="social" title="social-links">
      {networks}
    </ul>
  );
}

/* istanbul ignore next */
SocialLinks.propTypes = {
  networks: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    _location,
    propName,
  ) {
    if (
      !('name' in propValue[key]) ||
      !('url' in propValue[key]) ||
      !('icon' in propValue[key])
    ) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  }).isRequired,
};
