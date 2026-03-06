import type { Network } from 'my-profile-shared';

import styles from './SocialLinks.module.scss';

type SocialLinksProps = {
  networks: Network[];
  size?: 'sm' | 'md' | 'lg';
};

function SocialLinks({ networks, size = 'md' }: SocialLinksProps) {
  return (
    <ul className={`${styles.links} ${styles[size]}`}>
      {networks.map((network) => (
        <li key={network.name}>
          <a
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            title={network.name}
          >
            <i className={network.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialLinks;
