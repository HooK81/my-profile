import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useProfile } from '../../../hooks/useProfile';
import { useAppStore } from '../../../stores/app.store';
import LocaleSwitcher from '../../ui/LocaleSwitcher/LocaleSwitcher';
import Logo from '../../ui/Logo/Logo';
import styles from './Navbar.module.scss';

type NavItem =
  | { type: 'section'; id: string; label: string }
  | { type: 'route'; path: string; label: string };

function Navbar() {
  const { t } = useTranslation();
  const activeSection = useAppStore((s) => s.activeSection);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const isHome = location.pathname === '/';

  const NAV_ITEMS: NavItem[] = [
    { type: 'section', id: 'hero', label: t('navbar.home') },
    { type: 'section', id: 'about', label: t('navbar.aboutMe') },
    { type: 'section', id: 'resume', label: t('navbar.resume') },
    { type: 'section', id: 'techs', label: t('navbar.techs') },
    { type: 'section', id: 'contact', label: t('navbar.contact') },
    {
      type: 'route',
      path: '/about-this-site',
      label: t('navbar.aboutThisSite'),
    },
  ];

  const handleSectionClick = (id: string) => {
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      void navigate(`/#${id}`);
    }
  };

  const handleRouteClick = (path: string) => {
    setMenuOpen(false);
    if (location.pathname !== path) {
      void navigate(path);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.type === 'section') {
      return isHome && activeSection === item.id;
    }
    return location.pathname === item.path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <button
          className={styles.logo}
          onClick={() => handleSectionClick('hero')}
          aria-label={t('navbar.home')}
        >
          <Logo name={profile?.user.fullName ?? ''} />
        </button>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('navbar.toggleMenu')}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.menuOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                className={`${styles.link} ${isActive(item) ? styles.active : ''}`}
                onClick={() =>
                  item.type === 'section'
                    ? handleSectionClick(item.id)
                    : handleRouteClick(item.path)
                }
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className={styles.mobileLocale}>
            <LocaleSwitcher variant="inline" />
          </li>
        </ul>

        <div className={styles.desktopLocale}>
          <LocaleSwitcher variant="dropdown" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
