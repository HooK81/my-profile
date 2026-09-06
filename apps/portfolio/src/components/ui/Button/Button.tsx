import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import Icon from '../Icon/Icon';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';

type ButtonColors = {
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  hoverText: string;
};

const ACCENT_GRADIENT =
  'linear-gradient(135deg, var(--primary), var(--primary-soft))';

const defaultColors: Record<ButtonVariant, ButtonColors> = {
  primary: {
    bg: ACCENT_GRADIENT,
    border: 'transparent',
    text: 'var(--on-primary)',
    hoverBg: ACCENT_GRADIENT,
    hoverText: 'var(--on-primary)',
  },
  secondary: {
    bg: 'var(--surface)',
    border: 'var(--border)',
    text: 'var(--text)',
    hoverBg: 'var(--surface-strong)',
    hoverText: 'var(--primary)',
  },
};

type BaseProps = {
  variant: ButtonVariant;
  colors?: ButtonColors;
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
};

const preventClick = (event: React.SyntheticEvent) => event.preventDefault();

type AnchorProps = BaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseProps
  >;

type NativeButtonProps = BaseProps & { href?: never } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseProps
  >;

type ButtonProps = AnchorProps | NativeButtonProps;

function Button({
  variant,
  colors,
  className,
  isLoading = false,
  children,
  ...rest
}: ButtonProps) {
  const c = colors ?? defaultColors[variant];

  const cssVars = {
    '--btn-bg': c.bg,
    '--btn-border': c.border,
    '--btn-text': c.text,
    '--btn-hover-bg': c.hoverBg,
    '--btn-hover-text': c.hoverText,
  } as React.CSSProperties;

  const combinedClassName = className
    ? `${styles.btn} ${className}`
    : styles.btn;

  const sharedProps = {
    className: combinedClassName,
    style: cssVars,
    'data-variant': variant,
    'data-loading': isLoading || undefined,
    'aria-busy': isLoading || undefined,
  };

  const content = (
    <>
      <span className={styles.content}>{children}</span>
      {isLoading && <Icon name="LuLoaderCircle" className={styles.loader} />}
    </>
  );

  if ('href' in rest && rest.href != null) {
    return (
      <a
        {...rest}
        {...sharedProps}
        onClick={isLoading ? preventClick : rest.onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rest}
      {...sharedProps}
      onClick={isLoading ? preventClick : rest.onClick}
    >
      {content}
    </button>
  );
}

export default Button;
