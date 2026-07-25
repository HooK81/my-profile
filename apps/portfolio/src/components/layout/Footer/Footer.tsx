import { useProfile } from '../../../hooks/useProfile';
import SocialLinks from '../../ui/SocialLinks/SocialLinks';
import styles from './Footer.module.scss';

function Footer() {
  const { data: profile } = useProfile();
  if (!profile) {
    return null;
  }

  const { user } = profile;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <SocialLinks networks={user.networks} size="sm" />
        <p className={styles.copyright}>
          {import.meta.env.VITE_APP_VERSION &&
            `v${import.meta.env.VITE_APP_VERSION} · `}
          &copy; {new Date().getFullYear()} {user.fullName}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
