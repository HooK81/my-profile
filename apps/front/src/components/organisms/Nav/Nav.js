/**
 * Nav
 */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { getScrollPosition, getElementHeight } from '../../../utils/window';
import { useDispatch } from 'react-redux';
import { setLocale } from '../../../redux/app/actions';
import { NavItem } from '../../atoms/NavItem/NavItem';
import i18n from 'i18next';
import './Nav.scss';

/**
 * Nav Component
 * @param {object} props
 */
export function Nav(props) {
  /*----------------------------------------------------*/
  /*	Hide mobile menu on click
  ------------------------------------------------------*/
  const [isMenuDisplayed, setMenuDisplayed] = useState(false);
  useEffect(() => {
    function handleOutsideClick() {
      // Hide menu on click, if menu is displayed
      if (!isMenuDisplayed) {
        return;
      }
      setMenuDisplayed(false);
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuDisplayed]);

  /*----------------------------------------------------*/
  /*	Fade In/Out Primary Navigation
  ------------------------------------------------------*/
  const [menuState, setMenuState] = useState('opaque');

  const onHomeScroll = useCallback(() => {
    const { y } = getScrollPosition();
    const h = getElementHeight('header', 'tag');
    let nextState = 'opaque';
    if (y > h * 0.2 && y < h && window.outerWidth > 768) {
      nextState = 'hidden';
    } else {
      if (y < h * 0.2) {
        nextState = 'transparent';
      }
    }
    if (menuState !== nextState) {
      setMenuState(nextState);
    }
  }, [menuState]);

  useEffect(() => {
    // This hook is executed only once  (by pathname).
    // Used to setup the event scroll to onHomeScroll for home page
    const handleHomeScroll = throttle(onHomeScroll, 300);

    let eventScroll = null;
    if (props.home) {
      eventScroll = handleHomeScroll;
      // call handler once
      handleHomeScroll();
    }
    window.addEventListener('scroll', eventScroll);
    return () => window.removeEventListener('scroll', eventScroll);
  }, [props.home, onHomeScroll]);

  const menuClass = `${menuState} ${isMenuDisplayed ? 'opened' : ''}`;

  /*----------------------------------------------------*/
  /*	Change language
  ------------------------------------------------------*/
  const dispatch = useDispatch();
  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    dispatch(setLocale(lng));
  };

  return (
    <nav id="nav-wrap" className={menuClass}>
      <i
        className="mobile-btn mobile-btn-show"
        title="Show navigation"
        onClick={() => setMenuDisplayed(true)}
      >
        Show navigation
      </i>
      <i
        className="mobile-btn mobile-btn-hide"
        title="Hide navigation"
        onClick={() => setMenuDisplayed(false)}
      >
        Hide navigation
      </i>

      <ul id="nav" className="nav">
        {props.items.map((item) => (
          <NavItem
            key={item.id}
            to={item.to}
            label={item.label}
            {...(item.smoothItem !== undefined && {
              smoothItem: item.smoothItem,
            })}
            {...(item.smoothDuration !== undefined && {
              smoothDuration: item.smoothDuration,
            })}
            {...(item.smoothActiveClass !== undefined && {
              smoothActiveClass: item.smoothActiveClass,
            })}
            onSetActive={(hash) => props.onSetActiveAfterScroll(hash)}
            onScrollLinkError={(to) => props.onScrollLinkError(to)}
          />
        ))}
        <li className="languages">
          <span
            className="language"
            title="English"
            onClick={() => changeLanguage('en')}
          >
            <span className="flag-icon flag-icon-gb"></span>
          </span>
          <span
            className="language"
            title="Français"
            onClick={() => changeLanguage('fr')}
          >
            <span className="flag-icon flag-icon-fr"></span>
          </span>
        </li>
      </ul>
    </nav>
  );
}

/* istanbul ignore next */
Nav.defaultProps = {
  onSetActiveAfterScroll: () => {},
  onScrollLinkError: () => {},
  onItemSelect: () => {},
  home: false,
};
Nav.propTypes = {
  items: PropTypes.array.isRequired,
  home: PropTypes.bool,
  onSetActiveAfterScroll: PropTypes.func,
  onScrollLinkError: PropTypes.func,
  onItemSelect: PropTypes.func,
};
