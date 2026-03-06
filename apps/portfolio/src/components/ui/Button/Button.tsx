import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

type ButtonVariant = 'filled' | 'outlined';

type ButtonColors = {
  bg: string;
  border: string;
  text: string;
  hoverBg: string;
  hoverText: string;
};

const defaultColors: Record<ButtonVariant, ButtonColors> = {
  outlined: {
    bg: 'transparent',
    border: 'var(--color-teal)',
    text: 'var(--color-teal)',
    hoverBg: 'var(--color-teal)',
    hoverText: 'var(--color-darkest)',
  },
  filled: {
    bg: 'var(--color-teal)',
    border: 'var(--color-teal)',
    text: 'var(--color-darkest)',
    hoverBg: 'var(--color-light)',
    hoverText: 'var(--color-darkest)',
  },
};

type BaseProps = {
  variant?: ButtonVariant;
  colors?: ButtonColors;
  className?: string;
  children: React.ReactNode;
};

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
  variant = 'outlined',
  colors,
  className,
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

  if ('href' in rest && rest.href != null) {
    return <a className={combinedClassName} style={cssVars} {...rest} />;
  }

  return <button className={combinedClassName} style={cssVars} {...rest} />;
}

export default Button;
