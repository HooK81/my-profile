export const COOKIE_NAME = 'access_token';

export const JWT_CONSTANTS = {
  EXPIRES_IN: process.env.NODE_ENV !== 'production' ? '24h' : '5m',
  EXPIRES_IN_MS: process.env.NODE_ENV !== 'production' ? 86_400_000 : 300_000,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
} as const;
