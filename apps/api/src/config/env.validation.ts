import { z } from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    APP_ENV: z.enum(['local', 'development', 'production']).default('local'),

    PORT: z.coerce.number().min(1).max(65535).optional().default(3000),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    PUBLIC_APP_URL: z.url(),
    COOKIE_SECURE: z.stringbool({ truthy: ['true'], falsy: ['false'] }),
    JWT_SECRET: z.string(),
    DEVICE_FINGERPRINT_SECRET: z.string(),
    USERS_FOLDER: z.string(),
    MAILER_TRANSPORT: z.string(),
    MAILER_SENDER: z.string(),
    MAILER_TEAM_ADDRESS: z.email(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') {
      return;
    }
    if (!env.COOKIE_SECURE) {
      ctx.addIssue({
        code: 'custom',
        path: ['COOKIE_SECURE'],
        message: 'COOKIE_SECURE=false is forbidden in production',
      });
    }
    if (!env.PUBLIC_APP_URL.startsWith('https:')) {
      ctx.addIssue({
        code: 'custom',
        path: ['PUBLIC_APP_URL'],
        message: 'PUBLIC_APP_URL must use https: in production',
      });
    }
  });

export default (config: Record<string, unknown>): Record<string, unknown> => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:\n',
      z.prettifyError(result.error),
    );
    process.exit(1);
  }

  return result.data;
};
