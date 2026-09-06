import { getInitials } from '../../../utils/initials';
import styles from './Logo.module.scss';

function Logo({ name }: { name: string }) {
  return (
    <span className={styles.logo} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

export default Logo;
