/**
 * Header
 * @author Julien CROCHET <julien@crochet.me>
 */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Nav } from '../../organisms/Nav/Nav';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { getWindowResolution } from '../../../utils/window';
import './Header.scss';

/**
 * Header Component
 * @param {object} props
 */
export function Header(props) {
  /*----------------------------------------------------*/
  /* Make sure that home header background image height is qual to the browser height.
  ------------------------------------------------------*/
  const location = useLocation();
  const headerRef = useRef();
  const [resolution, setResolution] = useState(getWindowResolution());

  useEffect(() => {
    function handleResize() {
      setResolution(getWindowResolution());
    }
    const debouncedResize = _.debounce(handleResize, 300);
    if (location.pathname === '/') {
      window.addEventListener('resize', debouncedResize);
      headerRef.current.style.height = `${resolution.height}px`;
    }

    return () => window.removeEventListener('resize', debouncedResize);
  }, [resolution, location.pathname]);

  /*----------------------------------------------------*/
  /*	Browser history on active link
  ------------------------------------------------------*/
  const history = useHistory();
  const debouncedHistoryPush = _.debounce(history.push, 300);

  function setActive(hash) {
    if (location.pathname === '/' && (!location.hash || location.hash === '#home') && (!hash || hash === 'home')) {
      // Do not add an history for home
      return;
    }
    debouncedHistoryPush({
      pathname: location.pathname,
      hash: hash,
    });
  }

  const { t } = useTranslation();
  const navItems = [
    { id: 1, to: { pathname: '/', hash: 'home' }, label: t('menu.home') },
    { id: 2, to: { pathname: '/', hash: 'about' }, label: t('menu.about_me') },
    { id: 3, to: { pathname: '/', hash: 'resume' }, label: t('menu.resume') },
    { id: 4, to: { pathname: '/', hash: 'techs' }, label: t('menu.techs') },
    { id: 5, to: { pathname: '/', hash: 'contact' }, label: t('menu.contact') },
    { id: 6, to: { pathname: '/about-site' }, label: t('menu.about_site') },
  ];

  return (
    <header id={props.id} ref={headerRef}>
      <Nav items={navItems} onSetActiveAfterScroll={setActive} />
      {props.children}
    </header>
  );
}

Header.propTypes = {
  id: PropTypes.string.isRequired,
};
