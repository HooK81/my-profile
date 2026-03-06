export const JWT_CONSTANTS = {
  EXPIRES_IN: process.env.NODE_ENV !== 'production' ? '24h' : '5m',
} as const;
