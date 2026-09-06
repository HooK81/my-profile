import styles from './AppError.module.scss';

type CryingCloudProps = {
  className?: string;
};

function CryingCloud({ className }: CryingCloudProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <g className={styles.cloud}>
        <circle cx="72" cy="88" r="32" fill="currentColor" />
        <circle cx="110" cy="74" r="40" fill="currentColor" />
        <circle cx="142" cy="94" r="28" fill="currentColor" />
        <rect
          x="40"
          y="88"
          width="130"
          height="34"
          rx="17"
          fill="currentColor"
        />
      </g>

      <g
        stroke="var(--bg)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      >
        <path d="M82 84c4-6 12-6 16 0" />
        <path d="M120 84c4-6 12-6 16 0" />
        <path d="M98 108c6-7 14-7 20 0" />
      </g>

      <g fill="var(--primary-soft)">
        <path
          className={styles.tear1}
          d="M74 126c0 0 8 11 8 16a8 8 0 0 1-16 0c0-5 8-16 8-16z"
        />
        <path
          className={styles.tear2}
          d="M108 132c0 0 8 11 8 16a8 8 0 0 1-16 0c0-5 8-16 8-16z"
        />
        <path
          className={styles.tear3}
          d="M140 128c0 0 8 11 8 16a8 8 0 0 1-16 0c0-5 8-16 8-16z"
        />
      </g>
    </svg>
  );
}

export default CryingCloud;
