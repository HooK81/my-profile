import { getInitials } from '../../../utils/initials';
import styles from './Logo.module.scss';

function Logo({ name }: { name: string }) {
  return (
    <svg className={styles.logo} viewBox="0 0 100 100" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
        letterSpacing="3"
        fill="currentColor"
      >
        {getInitials(name)}
      </text>
    </svg>
  );
}

export default Logo;
