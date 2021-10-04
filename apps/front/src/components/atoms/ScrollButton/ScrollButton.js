/**
 * Scroll Button
 */

import PropTypes from 'prop-types';
import { Link, animateScroll as scroll } from 'react-scroll';

import './ScrollButton.scss';

/**
 * Scroll Button Component
 * @param object props
 */
export function ScrollButton(props) {
  function scrollToTop() {
    scroll.scrollToTop();
  }

  const iconClassName =
    props.type === 'down' ? 'fas fa-chevron-circle-down' : 'fas fa-angle-up';

  let link;
  if (props.type === 'top') {
    link = <i className={iconClassName} onClick={() => scrollToTop()}></i>;
  } else {
    link = (
      <Link
        href={props.linkTo}
        to={props.linkTo}
        spy={true}
        smooth={true}
        offset={props.offset}
        duration={props.duration}
      >
        <i className={iconClassName}></i>
      </Link>
    );
  }

  return <div className={`scroll-button ${props.type}`}>{link}</div>;
}

ScrollButton.defaultProps = {
  offset: 0,
  duration: 800,
};

/* istanbul ignore next */
ScrollButton.propTypes = {
  type: PropTypes.oneOf(['down', 'up', 'top']).isRequired,
  linkTo: function (props, propName, componentName) {
    if (props.type !== 'top' && !props[propName]) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed.`,
      );
    }
  },
  offset: PropTypes.number,
  duration: PropTypes.number,
};
