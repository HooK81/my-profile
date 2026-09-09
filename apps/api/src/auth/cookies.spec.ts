import { accessCookieOptions } from './cookies.js';

describe('accessCookieOptions', () => {
  it('should build a strict, http-only cookie scoped to /api', () => {
    expect(accessCookieOptions(true, 1000)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api',
      maxAge: 1000,
    });
  });

  it('should propagate the secure flag', () => {
    expect(accessCookieOptions(false).secure).toBe(false);
  });

  it('should omit maxAge when not given', () => {
    expect(accessCookieOptions(true)).not.toHaveProperty('maxAge');
  });

  it('should stay host-only (no domain attribute)', () => {
    expect(accessCookieOptions(true)).not.toHaveProperty('domain');
  });
});
