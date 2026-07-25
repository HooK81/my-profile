import type { Engine, ISourceOptions } from '@tsparticles/engine';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Typed from 'typed.js';

import { useProfile } from '../../../hooks/useProfile';
import ScrollDown from '../../ui/ScrollDown/ScrollDown';
import styles from './Hero.module.scss';

const particlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  particles: {
    number: { value: 80, density: { enable: true } },
    paint: { color: { value: '#ffffff' } },
    shape: { type: 'circle' },
    opacity: { value: 0.5 },
    size: { value: { min: 1, max: 6 } },
    links: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'repulse' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      repulse: { distance: 200, duration: 0.4 },
      push: { quantity: 4 },
    },
  },
  detectRetina: true,
};

// ParticlesProvider requires the init callback to be stable across renders
const initParticles = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

function Hero() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current || !profile) {
      return;
    }

    const { occupation, address } = profile.user;
    const city = address?.city;
    const typedString = city
      ? `${occupation} ${t('hero.basedIn')} ${city}`
      : occupation;

    const typed = new Typed(typedRef.current, {
      strings: [typedString],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    });

    return () => typed.destroy();
  }, [profile, t]);

  if (!profile) {
    return null;
  }

  const { user } = profile;

  return (
    <section id="hero" className={styles.hero}>
      <ParticlesProvider init={initParticles}>
        <Particles
          id="tsparticles"
          className={styles.particles}
          options={particlesOptions}
        />
      </ParticlesProvider>

      <div className={styles.content}>
        <p className={`${styles.welcome} ${styles.fadeUp1}`}>
          {t('hero.iAmA')} <span ref={typedRef} className={styles.typedText} />
        </p>

        <div className={styles.fadeUp2}>
          <h1 className={styles.name}>{user.fullName}</h1>
        </div>

        <div className={styles.fadeUp3}>
          <div className={styles.description}>
            <ReactMarkdown>{user.description}</ReactMarkdown>
          </div>
        </div>
      </div>

      <ScrollDown href="#about" />
    </section>
  );
}

export default Hero;
