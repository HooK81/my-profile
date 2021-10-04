/**
 * Nav Item
 */

import { Link as ScrollLink } from 'react-scroll';
import { NavHashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
import './NavItem.scss';

/**
 * NavItem Component
 * @param {object} props
 */
export function NavItem(props) {
  function checkTargetHashLink(to) {
    const targetExists = document.getElementById(to.hash);
    if (targetExists === null) {
      props.onScrollLinkError(to);
      return false;
    }
    return true;
  }

  let link;
  let location = useLocation();
  if (props.to.hash && props.to.pathname === location.pathname) {
    link = (
      <ScrollLink
        to={props.to.hash}
        spy={true}
        smooth={true}
        offset={props.smoothOffset}
        duration={props.smoothDuration}
        activeClass={props.smoothActiveClass}
        onClick={(e) => {
          checkTargetHashLink(props.to);
          props.onItemSelect(e, props.to);
        }}
        onSetActive={(hashName) => props.onSetActive(hashName)}
      >
        {props.label}
      </ScrollLink>
    );
  } else {
    link = (
      <NavHashLink
        to={props.to}
        exact
        activeClassName={props.smoothActiveClass}
        onClick={(e) => props.onItemSelect(e)}
      >
        {props.label}
      </NavHashLink>
    );
  }

  return <li>{link}</li>;
}

/* istanbul ignore next */
NavItem.defaultProps = {
  smoothItem: false,
  smoothOffset: 0,
  smoothDuration: 800,
  smoothActiveClass: 'active',
  onItemSelect: () => {},
  onSetActive: () => {},
  onScrollLinkError: () => {},
};

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.object.isRequired,
  smoothItem: PropTypes.bool,
  smoothOffset: PropTypes.number,
  smoothDuration: PropTypes.number,
  smoothActiveClass: PropTypes.string,
  onItemSelect: PropTypes.func,
  onSetActive: PropTypes.func,
  onScrollLinkError: PropTypes.func,
};
