import type { Container, Engine, ISourceOptions } from '@tsparticles/engine';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Typed from 'typed.js';

import { useProfile } from '../../../hooks/useProfile';
import { useTheme } from '../../../hooks/useTheme';
import type { Theme } from '../../../utils/theme';
import ScrollDown from '../../ui/ScrollDown/ScrollDown';
import styles from './Hero.module.scss';

const PARTICLE_COLORS: Record<Theme, string> = {
  dark: '#ffffff',
  light: '#0f172a',
};

const buildParticlesOptions = (color: string): ISourceOptions => ({
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: { value: 80, limit: { value: 160 }, density: { enable: true } },
    paint: { color: { value: color } },
    shape: { type: 'circle' },
    opacity: { value: 0.5 },
    size: { value: { min: 1, max: 6 } },
    links: {
      enable: true,
      distance: 150,
      color,
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    detectsOn: 'canvas',
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
});

// ParticlesProvider requires the init callback to be stable across renders
const initParticles = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

function Hero() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { theme } = useTheme();
  const typedRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<Container | undefined>(undefined);

  const particlesOptions = useMemo(
    () => buildParticlesOptions(PARTICLE_COLORS[theme]),
    [theme],
  );

  const handleParticlesLoaded = useCallback((container?: Container) => {
    if (containerRef.current && containerRef.current !== container) {
      containerRef.current.destroy();
    }
    containerRef.current = container;
  }, []);

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
      showCursor: false,
    });

    console.log('typed');

    return () => typed.destroy();
  }, [profile, t]);

  if (!profile) {
    return null;
  }

  const { user } = profile;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glow1} />
        <span className={styles.glow2} />
      </div>

      <ParticlesProvider init={initParticles}>
        <Particles
          key={theme}
          id="tsparticles"
          className={styles.particles}
          options={particlesOptions}
          particlesLoaded={handleParticlesLoaded}
        />
      </ParticlesProvider>

      <div className={styles.content}>
        <p className={`${styles.welcome} ${styles.fadeUp1}`}>
          {t('hero.iAmA')} <span ref={typedRef} className={styles.typedText} />
          <span className={styles.caret} aria-hidden="true" />
        </p>

        <h1 className={`${styles.name} ${styles.fadeUp2}`}>{user.fullName}</h1>

        <div className={`${styles.description} ${styles.fadeUp3}`}>
          <ReactMarkdown>{user.description}</ReactMarkdown>
        </div>
      </div>

      <ScrollDown href="#about" />
    </section>
  );
}

export default Hero;
