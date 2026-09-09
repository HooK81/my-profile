import { configuration } from './configuration.js';
import { envSchema } from './env.validation.js';

function validEnv(): Record<string, string> {
  return {
    NODE_ENV: 'development',
    PUBLIC_APP_URL: 'http://localhost:5173',
    COOKIE_SECURE: 'false',
    JWT_SECRET: 'jwt_secret',
    DEVICE_FINGERPRINT_SECRET: 'device_fingerprint_secret',
    USERS_FOLDER: '../../docker/users/',
    MAILER_TRANSPORT: '{"streamTransport":true}',
    MAILER_SENDER: '"My Profile" <test@example.com>',
    MAILER_TEAM_ADDRESS: 'test@example.com',
  };
}

describe('envSchema', () => {
  it('should accept a development environment over http', () => {
    expect(envSchema.safeParse(validEnv()).success).toBe(true);
  });

  it.each([
    { scenario: 'missing', PUBLIC_APP_URL: undefined },
    { scenario: 'not a URL', PUBLIC_APP_URL: 'not a url' },
  ])(
    'should refuse a PUBLIC_APP_URL that is $scenario',
    ({ PUBLIC_APP_URL }) => {
      const env = { ...validEnv(), PUBLIC_APP_URL };

      expect(envSchema.safeParse(env).success).toBe(false);
    },
  );

  it.each(['maybe', '1', 'yes'])(
    'should refuse a COOKIE_SECURE that is not the literal true/false (%s)',
    (COOKIE_SECURE) => {
      const env = { ...validEnv(), COOKIE_SECURE };

      expect(envSchema.safeParse(env).success).toBe(false);
    },
  );

  describe('in production', () => {
    const prod = {
      ...validEnv(),
      NODE_ENV: 'production',
      PUBLIC_APP_URL: 'https://www.example.org',
      COOKIE_SECURE: 'true',
    };

    it('should accept https with Secure cookies', () => {
      expect(envSchema.safeParse(prod).success).toBe(true);
    });

    it('should refuse a PUBLIC_APP_URL over http', () => {
      const env = { ...prod, PUBLIC_APP_URL: 'http://www.example.org' };

      expect(envSchema.safeParse(env).success).toBe(false);
    });

    it('should refuse non-Secure cookies', () => {
      const env = { ...prod, COOKIE_SECURE: 'false' };

      expect(envSchema.safeParse(env).success).toBe(false);
    });
  });
});

describe('configuration', () => {
  it('should derive public_origin from PUBLIC_APP_URL, dropping any path', () => {
    vi.stubEnv('PUBLIC_APP_URL', 'http://localhost:5173/some/path');
    vi.stubEnv('COOKIE_SECURE', 'true');

    const config = configuration();

    expect(config.public_app_url).toBe('http://localhost:5173/some/path');
    expect(config.public_origin).toBe('http://localhost:5173');
    expect(config.cookie_secure).toBe(true);

    vi.unstubAllEnvs();
  });
});
