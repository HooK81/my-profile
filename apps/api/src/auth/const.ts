export const COOKIE_NAME = 'access_token';

export const JWT_CONSTANTS = {
  EXPIRES_IN: '5m',
  EXPIRES_IN_MS: 300_000,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
} as const;
