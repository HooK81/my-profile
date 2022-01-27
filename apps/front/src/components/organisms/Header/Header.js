/**
 * Header
 */
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Nav } from '../../organisms/Nav/Nav';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
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
      props.onResize(resolution);
    }
    const debouncedResize = debounce(handleResize, 300);
    if (props.home) {
      window.addEventListener('resize', debouncedResize);
      headerRef.current.style.height = `${resolution.height}px`;
      props.onResize(resolution);
    }

    return () => window.removeEventListener('resize', debouncedResize);
  }, [resolution, props]);

  /*----------------------------------------------------*/
  /*	Browser history on active link
  ------------------------------------------------------*/
  const history = useHistory();
  const debouncedHistoryPush = debounce(history.push, 300);

  /**
   * A link has been changed to "active"
   * @param {string} hash
   */
  function setActive(hash) {
    if (
      props.home &&
      (!location.hash || location.hash === '#home') &&
      hash === 'home'
    ) {
      // Do not add an history for home
      return;
    }
    debouncedHistoryPush({
      pathname: location.pathname,
      hash: hash,
    });
  }

  /**
   * An error occured when going to a hash link
   * @param {object} to
   */
  function onScrollLinkError(to) {
    // Add an history on wrong hash link.
    console.error('Invalid hash link', to);
    debouncedHistoryPush({
      pathname: to.pathname,
      hash: to.hash,
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
      <Nav
        home={props.home}
        items={navItems}
        onSetActiveAfterScroll={setActive}
        onScrollLinkError={onScrollLinkError}
      />
      {props.children}
    </header>
  );
}
Header.defaultProps = {
  home: false,
  onResize: () => {},
};
Header.propTypes = {
  id: PropTypes.string.isRequired,
  home: PropTypes.bool,
  onResize: PropTypes.func,
};
