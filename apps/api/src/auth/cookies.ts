import type { CookieOptions } from 'express';

import { COOKIE_PATH } from './const.js';

export function accessCookieOptions(
  secure: boolean,
  maxAgeMs?: number,
): CookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: COOKIE_PATH,
    ...(maxAgeMs !== undefined && { maxAge: maxAgeMs }),
  };
}
